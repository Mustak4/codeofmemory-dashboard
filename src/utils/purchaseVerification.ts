/**
 * Purchase verification utility
 * 
 * When a user completes a purchase on codeofmemory.com, they are redirected to
 * codeofmemory.com/signin with a purchase token. This utility verifies the token
 * against the Supabase database.
 */

import { supabase } from "@/lib/supabase";

export type PurchaseVerificationResult = {
  success: boolean;
  email: string;
  orderId?: string;
  error?: string;
};

/**
 * Verifies a purchase token from the orders table in Supabase
 * 
 * The token is created by the Stripe webhook handler when payment succeeds.
 * This function checks:
 * - Token exists in orders table
 * - Order status is 'completed'
 * - Email matches (if provided)
 * 
 * @param token - Purchase token from URL parameter
 * @param email - Email from URL parameter (for validation)
 * @returns Verification result with user email if successful
 */
export async function verifyPurchaseToken(
  token: string,
  email?: string
): Promise<PurchaseVerificationResult> {
  if (!token) {
    return {
      success: false,
      email: email || "",
      error: "Missing purchase token",
    };
  }

  try {
    // Query orders table for the purchase token
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, email, status, user_id, created_at')
      .eq('purchase_token', token)
      .eq('status', 'completed')
      .single();

    if (error || !order) {
      return {
        success: false,
        email: email || "",
        error: "Invalid or expired purchase token",
      };
    }

    // Verify email matches if provided
    if (email && order.email.toLowerCase() !== email.toLowerCase()) {
      return {
        success: false,
        email: email,
        error: "Email does not match purchase",
      };
    }

    // Check if token is too old (optional: expire after 24 hours)
    const tokenAge = Date.now() - new Date(order.created_at).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (tokenAge > maxAge) {
      return {
        success: false,
        email: order.email,
        error: "Purchase token has expired",
      };
    }

    return {
      success: true,
      email: order.email,
      orderId: order.id,
    };
  } catch (error) {
    console.error('Purchase verification error:', error);
    return {
      success: false,
      email: email || "",
      error: "Error verifying purchase token",
    };
  }
}

/**
 * Checks if we're on the main domain (now that everything is combined)
 * This function is kept for backwards compatibility but always returns true
 * since we're now on the main domain.
 */
export function isLoginSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  // Now that everything is combined, we're always on the main domain
  return true;
}

