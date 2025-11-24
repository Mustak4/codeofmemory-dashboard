import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, ShoppingBag, Plus, MessageSquare, Edit3, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMemorialLimit } from "@/hooks/useMemorialLimit";
import { supabase } from "@/lib/supabase";

type MemorialSummary = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "pending";
  updatedAt: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  biographyHtml?: string;
  avatarUrl?: string;
  heroUrl?: string;
};

type ActivityItem = {
  id: string;
  timestamp: string;
  description: string;
  category: "submission" | "update" | "system";
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canPublish, limitReached, publishedCount, maxAllowed } = useMemorialLimit();

  const navItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "memorials", label: "Memorials", icon: BookOpen },
      { id: "orders", label: "Purchases", icon: ShoppingBag },
    ],
    [],
  );

  const [memorials, setMemorials] = useState<MemorialSummary[]>([]);
  const [loadingMemorials, setLoadingMemorials] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const [activeSection, setActiveSection] = useState<string>("overview");

  // Load memorials from Supabase
  useEffect(() => {
    const loadMemorials = async () => {
      if (!user) {
        setLoadingMemorials(false);
        return;
      }

      try {
        setLoadingMemorials(true);
        const { data, error } = await supabase
          .from("memorials")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setMemorials(
            data.map((memorial) => ({
              id: memorial.id,
              name: memorial.name || "",
              slug: memorial.slug || "",
              status: memorial.status || "draft",
              updatedAt: memorial.updated_at || memorial.created_at || new Date().toISOString(),
              dateOfBirth: memorial.date_of_birth || undefined,
              dateOfDeath: memorial.date_of_death || undefined,
              biographyHtml: memorial.biography_html || undefined,
              avatarUrl: memorial.avatar_url || undefined,
              heroUrl: memorial.hero_url || undefined,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading memorials:", error);
        toast({
          title: "Error",
          description: "Failed to load memorials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingMemorials(false);
      }
    };

    loadMemorials();
  }, [user, toast]);

  // Load activity feed
  useEffect(() => {
    const loadActivity = async () => {
      if (!user) {
        setLoadingActivity(false);
        return;
      }

      try {
        setLoadingActivity(true);
        const activities: ActivityItem[] = [];

        // Get user's memorials to filter activities
        const { data: userMemorials } = await supabase
          .from("memorials")
          .select("id, name")
          .eq("user_id", user.id);

        if (!userMemorials) {
          setLoadingActivity(false);
          return;
        }

        const memorialIds = userMemorials.map((m) => m.id);
        const memorialMap = new Map(userMemorials.map((m) => [m.id, m.name]));

        // Get recent memorial updates (within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: memorialUpdates } = await supabase
          .from("memorials")
          .select("id, name, updated_at, created_at")
          .eq("user_id", user.id)
          .gte("updated_at", thirtyDaysAgo.toISOString())
          .order("updated_at", { ascending: false })
          .limit(10);

        if (memorialUpdates) {
          memorialUpdates.forEach((memorial) => {
            // Only show update if it's different from created_at (actual update, not creation)
            const isUpdate = new Date(memorial.updated_at).getTime() !== new Date(memorial.created_at).getTime();
            if (isUpdate) {
              activities.push({
                id: `memorial-update-${memorial.id}`,
                timestamp: memorial.updated_at,
                description: `Updated memorial: ${memorial.name}`,
                category: "update",
              });
            }
          });
        }

        // Get recent guestbook submissions
        if (memorialIds.length > 0) {
          const { data: submissions } = await supabase
            .from("guestbook_entries")
            .select("id, memorial_id, guest_name, created_at, status")
            .in("memorial_id", memorialIds)
            .order("created_at", { ascending: false })
            .limit(20);

          if (submissions) {
            submissions.forEach((submission) => {
              const memorialName = memorialMap.get(submission.memorial_id) || "Unknown memorial";
              const statusText = submission.status === "pending" ? "pending review" : submission.status;
              activities.push({
                id: `submission-${submission.id}`,
                timestamp: submission.created_at,
                description: `New guest submission from ${submission.guest_name} on ${memorialName} (${statusText})`,
                category: "submission",
              });
            });
          }
        }

        // Get recent orders
        const { data: orders } = await supabase
          .from("orders")
          .select("id, created_at, status, amount, currency")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (orders) {
          orders.forEach((order) => {
            const amount = (order.amount / 100).toFixed(2);
            const statusText = order.status === "completed" ? "completed" : order.status;
            activities.push({
              id: `order-${order.id}`,
              timestamp: order.created_at,
              description: `Order ${statusText}: ${order.currency.toUpperCase()} ${amount}`,
              category: "system",
            });
          });
        }

        // Get recent gallery additions
        if (memorialIds.length > 0) {
          const { data: galleryItems } = await supabase
            .from("gallery_items")
            .select("id, memorial_id, created_at")
            .in("memorial_id", memorialIds)
            .order("created_at", { ascending: false })
            .limit(15);

          if (galleryItems) {
            galleryItems.forEach((item) => {
              const memorialName = memorialMap.get(item.memorial_id) || "Unknown memorial";
              activities.push({
                id: `gallery-${item.id}`,
                timestamp: item.created_at,
                description: `Added photo to ${memorialName}`,
                category: "update",
              });
            });
          }
        }

        // Sort all activities by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Limit to 20 most recent activities
        setActivity(activities.slice(0, 20));
      } catch (error) {
        console.error("Error loading activity:", error);
      } finally {
        setLoadingActivity(false);
      }
    };

    loadActivity();
  }, [user]);

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sectionElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0.1, 0.5, 1],
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, [navItems]);

  // Calculate progress for each memorial
  const calculateProgress = (memorial: MemorialSummary): number => {
    let progress = 0;
    if (memorial.name) progress += 20;
    if (memorial.slug) progress += 10;
    if (memorial.dateOfBirth && memorial.dateOfDeath) progress += 20;
    if (memorial.biographyHtml && memorial.biographyHtml.length > 50) progress += 20;
    if (memorial.avatarUrl) progress += 15;
    if (memorial.heroUrl) progress += 15;
    return progress;
  };


  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderStatusBadge = (status: MemorialSummary["status"]) => {
    if (status === "published") {
      return <Badge className="bg-emerald-500/15 text-emerald-600">Published</Badge>;
    }

    if (status === "draft") {
      return <Badge variant="secondary">Draft</Badge>;
    }

    return <Badge className="bg-amber-500/15 text-amber-600">Pending Review</Badge>;
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getActivityIcon = (category: ActivityItem["category"]) => {
    if (category === "submission") {
      return <MessageSquare className="h-4 w-4" />;
    }
    if (category === "update") {
      return <Edit3 className="h-4 w-4" />;
    }
    return <ShoppingCart className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 lg:px-8 lg:py-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-6 rounded-2xl border bg-background shadow-sm">
            <div className="border-b p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</p>
            </div>
            <nav className="space-y-1 px-2 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                      "hover:bg-muted",
                      isActive ? "bg-muted text-foreground shadow-inner" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-12">
          <div className="sticky top-0 z-10 -mx-4 mb-2 border-b bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <Button size="sm" variant="ghost" onClick={signOut}>
                Sign out
              </Button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNavClick(item.id)}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <section id="overview" className="space-y-8">
            <header className="rounded-3xl border bg-background shadow-sm">
              <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                  <p className="mt-2 text-xl text-muted-foreground">
                    {user?.email ?? "Your CodeOfMemory account"}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Create and manage memorial experiences, review guest submissions, and publish when you&apos;re
                    ready.
                  </p>
                </div>
                <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                  <Button variant="outline" onClick={signOut}>
                    Sign out
                  </Button>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Recent activity</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep track of edits, submissions, and updates across your account.
                  </p>
                </div>
                <div className="divide-y border-t">
                  {loadingActivity ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-sm text-muted-foreground">Loading activity...</p>
                    </div>
                  ) : activity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-sm text-muted-foreground">No recent activity.</p>
                    </div>
                  ) : (
                    activity.map((item) => (
                      <div key={item.id} className="flex gap-3 py-4">
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          item.category === "submission" && "bg-amber-100 text-amber-600",
                          item.category === "update" && "bg-sky-100 text-sky-600",
                          item.category === "system" && "bg-emerald-100 text-emerald-600",
                        )}>
                          {getActivityIcon(item.category)}
                        </div>
                        <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(item.timestamp)}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "self-start md:self-center",
                              item.category === "submission" && "border-amber-200 text-amber-600",
                              item.category === "update" && "border-sky-200 text-sky-600",
                              item.category === "system" && "border-emerald-200 text-emerald-600",
                            )}
                          >
                            {item.category === "submission" && "Guest submission"}
                            {item.category === "update" && "Content update"}
                            {item.category === "system" && "Order"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </header>
          </section>

          <section id="memorials" className="space-y-5">
            <div className="rounded-3xl border bg-background shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold">Your memorials</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Continue editing, publish drafts, and share with friends and family.
                </p>
              </div>

              <div className="p-6">
                {loadingMemorials ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm text-muted-foreground">Loading memorials...</p>
              </div>
            ) : memorials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                <p className="text-sm text-muted-foreground">No memorials yet.</p>
                  <Button
                    size="lg"
                    onClick={() => {
                      if (limitReached) {
                        toast({
                          title: "Publish limit reached",
                          description: "You can only publish one memorial at a time. Order another memorial to publish more.",
                          variant: "destructive",
                        });
                        navigate("/order");
                        return;
                      }
                      
                      // Navigate to the memorial creation page
                      navigate("/create-memorial");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create your memorial
                  </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {memorials.map((memorial) => {
                  const progress = calculateProgress(memorial);
                  return (
                    <Card key={memorial.id} className="flex flex-col justify-between rounded-2xl border bg-background shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-lg font-semibold line-clamp-1">{memorial.name || "Untitled Memorial"}</CardTitle>
                          {renderStatusBadge(memorial.status)}
                        </div>
                        {memorial.slug && (
                          <CardDescription className="line-clamp-1">codeofmemory.com/memorial/{memorial.slug}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {memorial.avatarUrl && (
                          <div className="h-32 w-full rounded-lg overflow-hidden bg-muted">
                            <img src={memorial.avatarUrl} alt={memorial.name} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Build progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-[width]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>
                            Updated {new Date(memorial.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/50 p-4">
                        {memorial.status === "published" && memorial.slug && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/memorial/${memorial.slug}`)}
                          >
                            View
                          </Button>
                        )}
                        <Button size="sm" onClick={() => navigate(`/memorial/${memorial.id}/edit`)}>
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
                {/* Add new memorial card */}
                <Card 
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-background shadow-sm hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                  onClick={() => navigate("/order")}
                >
                  <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Order new QR code</p>
                      <p className="text-xs text-muted-foreground mt-1">Create another memorial</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
              </div>
            </div>
          </section>

          <section id="orders" className="space-y-5 pb-10">
            <div className="rounded-3xl border bg-background shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold">Order History</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  View your memorial QR code purchases and order details.
                </p>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No orders yet. Order your first memorial QR code to get started.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
