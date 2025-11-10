# Quick Start: Creating Stripe Webhook

## Step-by-Step Instructions

### 1. Go to Stripe Dashboard
Visit: https://dashboard.stripe.com/webhooks

### 2. Click "Add endpoint"

### 3. Set Endpoint URL
Enter your backend webhook URL:
```
https://your-backend-domain.com/api/webhooks/stripe
```

**Note**: You need a backend server to receive webhooks. Options:
- **Vercel**: Deploy serverless function
- **Netlify**: Deploy serverless function  
- **Railway/Render**: Deploy Express.js server
- **Local testing**: Use Stripe CLI (see below)

### 4. Select Events to Listen To
Check these events:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `checkout.session.completed`

### 5. Click "Add endpoint"

### 6. Get Webhook Signing Secret
1. Click on your newly created webhook
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)
4. Add to your `.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Testing Locally (Before Deploying)

Use Stripe CLI to test webhooks locally:

### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### Login
```bash
stripe login
```

### Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will:
- Show a webhook signing secret (starts with `whsec_`)
- Forward all webhook events to your local server
- Add that secret to your `.env` for local testing

### Test Webhook
In another terminal:
```bash
stripe trigger payment_intent.succeeded
```

## Production Setup

1. **Deploy your backend** with the webhook handler (see `api/webhooks/stripe.example.ts`)
2. **Create webhook in Stripe** pointing to your production URL
3. **Copy webhook secret** to your production environment variables
4. **Test** by making a real payment

## What Happens Next

1. User completes purchase on `codeofmemory.com`
2. Stripe sends webhook to your backend
3. Backend creates order in Supabase with `purchase_token`
4. Main site redirects user to: `login.codeofmemory.com/signin?purchase_token=...&email=...`
5. Dashboard verifies token against Supabase
6. User is auto-logged in

## Need Help?

- See `STRIPE_WEBHOOK_SETUP.md` for detailed documentation
- See `api/webhooks/stripe.example.ts` for example code
- Stripe docs: https://stripe.com/docs/webhooks

