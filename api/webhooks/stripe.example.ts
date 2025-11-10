/**
 * Stripe Webhook Handler Example
 * 
 * This is an example webhook handler for serverless functions (Vercel, Netlify, etc.)
 * 
 * To use:
 * 1. Copy this file to your backend server
 * 2. Install dependencies: npm install stripe @supabase/supabase-js
 * 3. Set environment variables
 * 4. Deploy to your hosting platform
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
      return;
    }

    // Check if user exists, create if not
    let userId: string | null = null;
    
    // Try to find existing user by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user in auth.users (Supabase Auth)
      // Note: This requires Supabase Admin API or service_role key
      // For now, we'll create the order and let the frontend create the user
      console.log('User will be created on first login');
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
    
    // Store purchase token in metadata for redirect
    // The main site should redirect to: login.codeofmemory.com/signin?purchase_token=...
    
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
    // Retrieve the payment intent
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
 * Main webhook handler
 * 
 * For Vercel: export as POST
 * For Express: app.post('/api/webhooks/stripe', handler)
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
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

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

