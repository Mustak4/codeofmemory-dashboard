# How to Get Your Webhook URL

## The Short Answer

**You don't "find" your webhook URL - you create it by deploying a backend server!**

After you deploy, your webhook URL will be:
```
https://your-project.vercel.app/api/webhooks/stripe
```

## Step-by-Step: Creating Your Webhook URL

### Option 1: Using Vercel (Recommended - You Already Have vercel.json!)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will ask if you want to link to an existing project or create new
   - Choose your options

4. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project on Vercel
   - Settings → Environment Variables
   - Add these:
     ```
     STRIPE_SECRET_KEY=sk_live_...
     STRIPE_WEBHOOK_SECRET=whsec_... (you'll get this after creating webhook)
     SUPABASE_URL=https://ikpoobjqswmjslyfygbx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

5. **Your Webhook URL will be**:
   ```
   https://your-project-name.vercel.app/api/webhooks/stripe
   ```
   Replace `your-project-name` with your actual Vercel project name.

6. **Create the webhook in Stripe**:
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter: `https://your-project-name.vercel.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the webhook secret and add it to Vercel environment variables

### Option 2: Using Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Login and deploy**:
   ```bash
   netlify login
   netlify deploy --prod
   ```

3. **Your webhook URL will be**:
   ```
   https://your-site.netlify.app/api/webhooks/stripe
   ```

### Option 3: Using Railway/Render (Express.js Server)

If you want a full Express.js server instead of serverless functions:

1. Create a separate backend project
2. Deploy to Railway or Render
3. Your webhook URL will be:
   ```
   https://your-backend.railway.app/api/webhooks/stripe
   ```

## Quick Test (Before Production)

For local testing, use Stripe CLI:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This gives you a local webhook secret for testing.

## What You Need

Before creating the webhook in Stripe, you need:

1. ✅ **Backend deployed** (Vercel/Netlify/etc.)
2. ✅ **Webhook endpoint created** (`api/webhooks/stripe.ts` - I've created this for you!)
3. ✅ **Environment variables set** (in your hosting platform)
4. ✅ **Webhook URL** (from your deployment)

## Example Flow

1. **Deploy to Vercel** → Get URL: `https://codeofmemory-dashboard.vercel.app`
2. **Your webhook URL is**: `https://codeofmemory-dashboard.vercel.app/api/webhooks/stripe`
3. **Add to Stripe**: Go to Stripe dashboard → Webhooks → Add endpoint
4. **Enter URL**: `https://codeofmemory-dashboard.vercel.app/api/webhooks/stripe`
5. **Get secret**: Copy the webhook secret from Stripe
6. **Add to Vercel**: Add `STRIPE_WEBHOOK_SECRET` to Vercel environment variables

## Files I've Created For You

- ✅ `api/webhooks/stripe.ts` - Vercel serverless function (TypeScript)
- ✅ `api/webhooks/stripe.js` - Alternative JavaScript version
- ✅ `api/webhooks/stripe.example.ts` - Example code with comments

## Next Steps

1. **Deploy to Vercel** (or your preferred platform)
2. **Get your deployment URL**
3. **Add `/api/webhooks/stripe` to the end**
4. **That's your webhook URL!**
5. **Add it to Stripe dashboard**

## Need Help?

- Vercel docs: https://vercel.com/docs
- Stripe webhooks: https://stripe.com/docs/webhooks
- See `STRIPE_WEBHOOK_SETUP.md` for detailed setup

