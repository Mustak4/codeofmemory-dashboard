# How to Get Your Webhook URL - Simple Guide

## The Answer

**You create your webhook URL by deploying your project!**

After deployment, your webhook URL will be:
```
https://your-deployment-url.com/api/webhooks/stripe
```

## Quick Steps

### 1. Deploy Your Project

**Option A: Vercel (Easiest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

After deployment, you'll get a URL like:
```
https://codeofmemory-dashboard.vercel.app
```

### 2. Your Webhook URL Is

```
https://codeofmemory-dashboard.vercel.app/api/webhooks/stripe
```

Just add `/api/webhooks/stripe` to the end of your deployment URL!

### 3. Add Environment Variables in Vercel

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` = (you'll get this after step 4)
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service_role key

### 4. Create Webhook in Stripe

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-project.vercel.app/api/webhooks/stripe`
4. Select events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## That's It!

Your webhook URL is now: `https://your-project.vercel.app/api/webhooks/stripe`

## Testing Locally First

Before deploying, test locally with Stripe CLI:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:8080/api/webhooks/stripe
```

This gives you a local webhook secret for testing.

## Summary

1. ✅ Deploy project → Get URL
2. ✅ Add `/api/webhooks/stripe` → That's your webhook URL!
3. ✅ Add to Stripe dashboard
4. ✅ Get webhook secret → Add to environment variables
5. ✅ Done!

