# Supabase Setup Guide

This guide will help you connect your Supabase database to the CodeOfMemory dashboard.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. You'll need:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   
   ⚠️ **IMPORTANT**: Use the **anon public** key, NOT the service_role key!
   - ✅ **anon key**: Safe for frontend, respects RLS policies
   - ❌ **service_role key**: NEVER use in frontend - bypasses all security!
   
   The anon key is in the "Project API keys" section, labeled as "anon" or "public".

## Step 2: Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/schema.sql` from this project
4. Copy and paste the entire SQL into the SQL Editor
5. Click **Run** to execute

This will create:
- All necessary tables (users, memorials, orders, gallery_items, family_members, guestbook_entries)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps
- Function to auto-create user profiles

## Step 4: Verify Setup

After running the schema, verify the tables were created:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `users`
   - `memorials`
   - `orders`
   - `gallery_items`
   - `family_members`
   - `guestbook_entries`

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed
4. Set **Site URL** to your dashboard URL (e.g., `https://login.codeofmemory.com`)

## Step 6: Test Connection

Start your development server:
```bash
npm run dev
```

The app should now connect to Supabase. Check the browser console for any connection errors.

## Database Schema Overview

### Tables

- **users**: User profiles (extends Supabase auth.users)
- **memorials**: Memorial pages created by users
- **orders**: Stripe purchase orders
- **gallery_items**: Photos/videos for memorials
- **family_members**: Family relationships for memorials
- **guestbook_entries**: Guest book messages

### Security

All tables use **Row Level Security (RLS)**:
- Users can only see/edit their own data
- Published memorials are publicly viewable
- Guestbook entries require approval before being public

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure your `.env` file exists and has the correct variable names
- Restart your dev server after creating/updating `.env`

### "Permission denied" errors
- Check that RLS policies are enabled
- Verify the user is authenticated
- Check that the user_id matches in the query

### Connection errors
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure your IP isn't blocked (check Supabase dashboard)

## Next Steps

After Supabase is connected:
1. Update `src/contexts/AuthContext.tsx` to use Supabase Auth
2. Update data fetching to use Supabase client
3. Set up Stripe webhook endpoint

