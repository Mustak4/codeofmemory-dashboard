# Stripe Webhook Setup Guide

## Overview

Stripe webhooks allow your backend to be notified when payment events occur (payment succeeded, failed, etc.). This is essential for:
- Verifying purchases
- Creating user accounts after payment
- Generating purchase tokens
- Updating order status

## Architecture

```
codeofmemory.com (main site)
    ↓ User completes purchase
    ↓ Redirects with purchase_token
login.codeofmemory.com (dashboard)
    ↓ Uses purchase_token to verify
    ↓ Calls backend API
Backend Server (webhook handler)
    ↓ Receives Stripe webhook
    ↓ Verifies purchase
    ↓ Creates order in Supabase
```

## Step 1: Create Stripe Webhook Endpoint

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Set Endpoint URL**: 
   ```
   https://your-backend-url.com/api/webhooks/stripe
   ```
   - This must be a publicly accessible HTTPS URL
   - For development, you can use Stripe CLI (see below)
4. **Select events to listen to**:
   - ✅ `payment_intent.succeeded` - Payment completed successfully
   - ✅ `payment_intent.payment_failed` - Payment failed
   - ✅ `checkout.session.completed` - Checkout session completed (if using Stripe Checkout)
   - ✅ `charge.succeeded` - Charge succeeded (alternative to payment_intent)
5. **Click "Add endpoint"**

## Step 2: Get Webhook Signing Secret

After creating the webhook:
1. Click on the webhook endpoint you just created
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)
4. Add it to your `.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Step 3: Backend Webhook Handler

You'll need a backend server to handle webhooks. Here's the structure:

### Option A: Serverless Function (Vercel/Netlify)

Create `api/webhooks/stripe.ts` (or `.js`):

```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service_role for backend
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

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
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(failedPayment);
      break;

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // 1. Generate purchase token
  const purchaseToken = generatePurchaseToken(paymentIntent.id);
  
  // 2. Create or get user
  const email = paymentIntent.metadata.email || paymentIntent.receipt_email;
  if (!email) {
    console.error('No email in payment intent');
    return;
  }

  // 3. Create order in Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: paymentIntent.customer as string,
      email: email,
      status: 'completed',
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      purchase_token: purchaseToken,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return;
  }

  console.log('Order created:', order.id);
  
  // 4. Redirect user to dashboard with purchase token
  // This is handled by the main site redirecting after payment
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update order status to failed
  await supabase
    .from('orders')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Similar to payment_intent.succeeded
  // Extract email and metadata from session
}

function generatePurchaseToken(paymentIntentId: string): string {
  // Generate a secure, one-time-use token
  // In production, use JWT or similar
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${paymentIntentId}-${timestamp}-${random}`;
}
```

### Option B: Express.js Server

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event (same as above)
  
  res.json({ received: true });
});
```

## Step 4: Testing with Stripe CLI (Development)

For local development, use Stripe CLI to forward webhooks:

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli
2. **Login**: `stripe login`
3. **Forward webhooks**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. **Copy the webhook signing secret** (starts with `whsec_`)
5. **Add to `.env`**: `STRIPE_WEBHOOK_SECRET=whsec_...`
6. **Test with**:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

## Step 5: Update Purchase Verification

Update `src/utils/purchaseVerification.ts` to verify tokens from Supabase:

```typescript
export async function verifyPurchaseToken(
  token: string,
  email?: string
): Promise<PurchaseVerificationResult> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('email, status, user_id')
    .eq('purchase_token', token)
    .eq('status', 'completed')
    .single();

  if (error || !order) {
    return {
      success: false,
      email: email || '',
      error: 'Invalid or expired purchase token',
    };
  }

  // Verify email matches if provided
  if (email && order.email !== email) {
    return {
      success: false,
      email: email,
      error: 'Email does not match purchase',
    };
  }

  return {
    success: true,
    email: order.email,
    orderId: order.id,
  };
}
```

## Security Checklist

- ✅ Verify webhook signature (prevents fake webhooks)
- ✅ Use HTTPS for webhook endpoint
- ✅ Store webhook secret securely (environment variable)
- ✅ Validate all webhook data
- ✅ Use idempotency keys to prevent duplicate processing
- ✅ Log all webhook events for debugging

## Next Steps

1. Set up your backend server (Vercel, Netlify, Railway, etc.)
2. Create the webhook endpoint
3. Test with Stripe CLI
4. Update purchase verification to use Supabase
5. Deploy and configure production webhook URL

