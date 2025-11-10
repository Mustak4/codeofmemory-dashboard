-- CodeOfMemory Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memorials table
CREATE TABLE IF NOT EXISTS public.memorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  date_of_death DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pending')),
  biography_html TEXT DEFAULT '',
  avatar_url TEXT,
  hero_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_memorial UNIQUE (user_id, slug)
);

-- Orders table (for Stripe purchases)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  purchase_token TEXT NOT NULL UNIQUE, -- Token for purchase verification
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family members table
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'spouse', 'child', 'sibling', 'grandchild')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guestbook entries table
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memorials_user_id ON public.memorials(user_id);
CREATE INDEX IF NOT EXISTS idx_memorials_slug ON public.memorials(slug);
CREATE INDEX IF NOT EXISTS idx_memorials_status ON public.memorials(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_purchase_token ON public.orders(purchase_token);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_gallery_memorial_id ON public.gallery_items(memorial_id);
CREATE INDEX IF NOT EXISTS idx_family_memorial_id ON public.family_members(memorial_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_memorial_id ON public.guestbook_entries(memorial_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON public.guestbook_entries(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memorials_updated_at BEFORE UPDATE ON public.memorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guestbook_updated_at BEFORE UPDATE ON public.guestbook_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Memorials policies
CREATE POLICY "Users can view their own memorials"
  ON public.memorials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Published memorials are viewable by everyone"
  ON public.memorials FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can insert their own memorials"
  ON public.memorials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorials"
  ON public.memorials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorials"
  ON public.memorials FOR DELETE
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Gallery items policies
CREATE POLICY "Gallery items are viewable with memorial"
  ON public.gallery_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = gallery_items.memorial_id
      AND (memorials.user_id = auth.uid() OR memorials.status = 'published')
    )
  );

CREATE POLICY "Users can manage gallery for their memorials"
  ON public.gallery_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = gallery_items.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Family members policies
CREATE POLICY "Family members are viewable with memorial"
  ON public.family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = family_members.memorial_id
      AND (memorials.user_id = auth.uid() OR memorials.status = 'published')
    )
  );

CREATE POLICY "Users can manage family for their memorials"
  ON public.family_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = family_members.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Guestbook entries policies
CREATE POLICY "Approved guestbook entries are viewable with memorial"
  ON public.guestbook_entries FOR SELECT
  USING (
    status = 'approved' AND
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = guestbook_entries.memorial_id
      AND (memorials.user_id = auth.uid() OR memorials.status = 'published')
    )
  );

CREATE POLICY "Users can view all entries for their memorials"
  ON public.guestbook_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = guestbook_entries.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert guestbook entries"
  ON public.guestbook_entries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update entries for their memorials"
  ON public.guestbook_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = guestbook_entries.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

