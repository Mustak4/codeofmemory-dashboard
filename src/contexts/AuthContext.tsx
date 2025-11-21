import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { verifyPurchaseToken } from "@/utils/purchaseVerification";
import type { User } from "@supabase/supabase-js";

type AuthUser = {
  id: string;
  email: string;
  emailVerified?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  // Verify purchase token from codeofmemory.com and auto-login user
  verifyPurchaseAndLogin: (purchaseToken: string, email?: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase User to AuthUser
  const mapSupabaseUser = (supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      emailVerified: supabaseUser.email_confirmed_at !== null,
    };
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
        return { success: true };
      }

      return { success: false, error: "Sign in failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during sign in",
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const verifyPurchaseAndLogin = async (purchaseToken: string, email?: string) => {
    try {
      const result = await verifyPurchaseToken(purchaseToken, email);
      
      if (!result.success) {
        return { success: false, error: result.error || "Purchase verification failed" };
      }

      // Store purchase info for later use (e.g., onboarding)
      if (result.orderId) {
        localStorage.setItem("com-purchase-order-id", result.orderId);
      }
      
      // Note: User should already be signed in via Supabase if they have an account
      // If they don't have an account yet, they'll need to sign in with credentials sent via email
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Purchase verification failed" 
      };
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOut,
      signIn,
      verifyPurchaseAndLogin,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


