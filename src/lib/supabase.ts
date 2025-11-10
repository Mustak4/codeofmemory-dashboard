import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be generated from Supabase schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          email_verified?: boolean;
          updated_at?: string;
        };
      };
      memorials: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          date_of_birth: string;
          date_of_death: string;
          status: 'draft' | 'published' | 'pending';
          biography_html: string;
          avatar_url: string | null;
          hero_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          date_of_birth: string;
          date_of_death: string;
          status?: 'draft' | 'published' | 'pending';
          biography_html?: string;
          avatar_url?: string | null;
          hero_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          date_of_birth?: string;
          date_of_death?: string;
          status?: 'draft' | 'published' | 'pending';
          biography_html?: string;
          avatar_url?: string | null;
          hero_url?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_intent_id: string | null;
          stripe_customer_id: string | null;
          email: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          amount: number;
          currency: string;
          purchase_token: string;
          memorial_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          email: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          amount: number;
          currency?: string;
          purchase_token: string;
          memorial_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          email?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          amount?: number;
          currency?: string;
          purchase_token?: string;
          memorial_id?: string | null;
          updated_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          memorial_id: string;
          url: string;
          alt: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          memorial_id: string;
          url: string;
          alt: string;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          memorial_id?: string;
          url?: string;
          alt?: string;
          order?: number;
        };
      };
      family_members: {
        Row: {
          id: string;
          memorial_id: string;
          name: string;
          relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'grandchild';
          created_at: string;
        };
        Insert: {
          id?: string;
          memorial_id: string;
          name: string;
          relationship: 'parent' | 'spouse' | 'child' | 'sibling' | 'grandchild';
          created_at?: string;
        };
        Update: {
          id?: string;
          memorial_id?: string;
          name?: string;
          relationship?: 'parent' | 'spouse' | 'child' | 'sibling' | 'grandchild';
        };
      };
      guestbook_entries: {
        Row: {
          id: string;
          memorial_id: string;
          guest_name: string;
          message: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          memorial_id: string;
          guest_name: string;
          message: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          memorial_id?: string;
          guest_name?: string;
          message?: string;
          status?: 'pending' | 'approved' | 'rejected';
          updated_at?: string;
        };
      };
    };
  };
};

