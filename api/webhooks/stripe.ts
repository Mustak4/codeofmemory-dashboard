/**
 * Stripe Webhook Handler for Vercel Serverless Functions
 * 
 * This file should be deployed to: /api/webhooks/stripe
 * 
 * After deployment, your webhook URL will be:
 * https://your-project.vercel.app/api/webhooks/stripe
 * 
 * Note: For Vercel, you may need to install:
 * npm install stripe @supabase/supabase-js
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must use service_role key for backend
);

/**
 * Generate a secure purchase token
 */
function generatePurchaseToken(paymentIntentId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${paymentIntentId}-${timestamp}-${random}`;
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Generate purchase token
    const purchaseToken = generatePurchaseToken(paymentIntent.id);
    
    // Get email from payment intent metadata or receipt
    const email = 
      paymentIntent.metadata?.email || 
      paymentIntent.receipt_email || 
      null;

    if (!email) {
      console.error('No email found in payment intent:', paymentIntent.id);
      return { success: false, error: 'No email found' };
    }

    // Check if user exists
    let userId: string | null = null;
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    }

    // Create order in database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer as string | null,
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

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
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

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const paymentIntentId = session.payment_intent as string;
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

/**
 * Vercel Serverless Function Handler
 * 
 * Vercel automatically routes requests to this file when deployed
 */
export default async function handler(req: any, res: any) {
  // Handle GET requests (health check)
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok',
      message: 'Stripe webhook endpoint is ready'
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'No signature' });
  }

  // Get raw body for signature verification
  const body = req.body;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: `Error: ${error.message}` });
  }
}

