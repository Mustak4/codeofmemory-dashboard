/**
 * Stripe Webhook Handler for Vercel (JavaScript version)
 * 
 * If you prefer JavaScript over TypeScript, use this file instead.
 * Rename it to stripe.ts and remove the .ts version.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Must use service_role key for backend
);

function generatePurchaseToken(paymentIntentId) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${paymentIntentId}-${timestamp}-${random}`;
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    const purchaseToken = generatePurchaseToken(paymentIntent.id);
    const email = 
      paymentIntent.metadata?.email || 
      paymentIntent.receipt_email || 
      null;

    if (!email) {
      console.error('No email found in payment intent:', paymentIntent.id);
      return { success: false, error: 'No email found' };
    }

    let userId = null;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer,
        email: email,
        status: 'completed',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        purchase_token: purchaseToken,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    console.log('Order created successfully:', order.id);
    return { success: true, orderId: order.id, purchaseToken };
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', paymentIntent.id);
    
    console.log('Payment failed, order updated:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleCheckoutCompleted(session) {
  try {
    const paymentIntentId = session.payment_intent;
    if (!paymentIntentId) {
      console.error('No payment intent in checkout session');
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    await handlePaymentSuccess(paymentIntent);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.json({ 
      status: 'ok',
      message: 'Stripe webhook endpoint is ready'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
};

