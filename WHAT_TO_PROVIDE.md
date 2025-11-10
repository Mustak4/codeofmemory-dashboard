# What to Provide for Supabase & Stripe Integration

## ✅ What I've Set Up

1. **Supabase client library** - Installed and configured
2. **Database schema** - Complete SQL schema in `supabase/schema.sql`
3. **Supabase client** - Created in `src/lib/supabase.ts`
4. **Environment template** - Created `env.example` file

## 📋 What You Need to Provide

### 1. Supabase Credentials

From your Supabase project dashboard (https://app.supabase.com):

1. Go to **Settings** → **API**
2. Copy these two values:

   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   ⚠️ **CRITICAL**: Use the **anon/public** key, NOT the service_role key!
   - The anon key is safe to expose in frontend code
   - The service_role key bypasses all security and should ONLY be used in secure backend servers
   - Look for the key labeled "anon" or "public" in the "Project API keys" section

3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Run Database Schema

1. Go to Supabase dashboard → **SQL Editor**
2. Open `supabase/schema.sql` from this project
3. Copy the entire SQL and paste into SQL Editor
4. Click **Run**

This creates all tables, indexes, security policies, and triggers.

### 3. Stripe Credentials (for webhooks)

From your Stripe dashboard (https://dashboard.stripe.com):

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`) - Keep this secret!

3. Add to your `.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 4. Stripe Webhook Setup

1. In Stripe dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://your-backend-url.com/api/webhooks/stripe`
   - (You'll need a backend server for webhooks - they can't run in the browser)
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 🔄 Next Steps After You Provide Credentials

Once you've:
1. ✅ Added Supabase credentials to `.env`
2. ✅ Run the database schema
3. ✅ Added Stripe credentials

I will:
1. Update `AuthContext` to use Supabase Auth
2. Update purchase verification to use Supabase
3. Create Stripe webhook handler structure
4. Update all data fetching to use Supabase

## 📝 Current Status

- ✅ Supabase client installed and configured
- ✅ Database schema ready to run
- ✅ Environment template created
- ⏳ Waiting for your Supabase credentials
- ⏳ Waiting for your Stripe credentials
- ⏳ Need to run database schema

## 🚀 Quick Start

1. **Get Supabase credentials** → Add to `.env`
2. **Run schema** → Copy `supabase/schema.sql` to Supabase SQL Editor
3. **Get Stripe credentials** → Add to `.env`
4. **Share credentials** → I'll complete the integration

---

**Note**: Never commit your `.env` file to git! It's already in `.gitignore`.

