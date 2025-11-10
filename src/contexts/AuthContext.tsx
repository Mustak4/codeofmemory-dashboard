import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email: string;
  emailVerified?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
  // Placeholder: In MVP we simulate magic-link flow locally.
  requestMagicLink: (email: string) => Promise<void>;
  completeMagicLink: (email: string, token?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "com-auth-user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const requestMagicLink = async (email: string) => {
    // In production, call backend to send email magic link.
    // Here we just simulate delay.
    await new Promise((r) => setTimeout(r, 500));
    // No-op
  };

  const completeMagicLink = async (email: string) => {
    // Simulate verification and set user
    const simulatedUser: AuthUser = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      email,
      emailVerified: true,
    };
    setUser(simulatedUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulatedUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOut,
      requestMagicLink,
      completeMagicLink,
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


