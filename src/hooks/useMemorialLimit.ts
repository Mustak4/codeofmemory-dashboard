import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to check if user has reached their memorial publish limit.
 * Currently: users can only publish ONE memorial at a time.
 * To publish more, they need to purchase additional entitlements via /order.
 */
export const useMemorialLimit = () => {
  const { user } = useAuth();

  // Mock: In production, this would query the backend for published memorials count
  // For now, we simulate by checking localStorage or a mock data source
  const publishedCount = useMemo(() => {
    if (!user) return 0;
    
    // Check localStorage for published memorials (mock implementation)
    try {
      const stored = localStorage.getItem(`com-memorials-${user.id}`);
      if (stored) {
        const memorials = JSON.parse(stored) as Array<{ status: string }>;
        return memorials.filter((m) => m.status === "published").length;
      }
    } catch {
      // ignore
    }
    
    // Fallback: check mock data from dashboard
    // In real app, this would be a backend call
    const mockMemorials = [
      { id: "mem-1", status: "draft" },
    ];
    return mockMemorials.filter((m) => m.status === "published").length;
  }, [user]);

  const canPublish = publishedCount < 1;
  const limitReached = !canPublish;

  return {
    publishedCount,
    canPublish,
    limitReached,
    maxAllowed: 1,
  };
};

