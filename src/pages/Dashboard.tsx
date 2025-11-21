import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, ListChecks, History, CreditCard, ArrowUpRight, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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

type NextStep = {
  id: string;
  title: string;
  description: string;
  cta: {
    label: string;
    to: string;
  };
  status: "ready" | "in-progress" | "blocked";
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
      { id: "tasks", label: "Next Steps", icon: ListChecks },
      { id: "activity", label: "Activity", icon: History },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
    [],
  );

  const [memorials, setMemorials] = useState<MemorialSummary[]>([]);
  const [loadingMemorials, setLoadingMemorials] = useState(true);

  const nextSteps = useMemo<NextStep[]>(() => [], []);

  const activity = useMemo<ActivityItem[]>(() => [], []);

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

  const totalMemorials = memorials.length;
  const publishedMemorials = memorials.filter((mem) => mem.status === "published").length;
  
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

  const stats = [
    {
      label: "Memorials",
      value: `${totalMemorials}`,
      helper: `${publishedMemorials} published`,
    },
    {
      label: "Draft memorials",
      value: `${memorials.filter((mem) => mem.status === "draft").length}`,
      helper: "In progress",
    },
    {
      label: "Storage",
      value: "0 GB",
      helper: "of 10 GB plan limit",
    },
    {
      label: "Publish limit",
      value: `${publishedCount}/${maxAllowed}`,
      helper: limitReached ? "Order more to publish" : "Can publish more",
    },
  ];

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

  const renderStepStatusIcon = (status: NextStep["status"]) => {
    if (status === "ready") {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (status === "in-progress") {
      return <Clock className="h-4 w-4 text-sky-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-amber-500" />;
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
              <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    {user?.email ?? "Your CodeOfMemory account"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
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
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-none bg-muted/40 shadow-none">
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.helper}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </header>
          </section>

          <section id="memorials" className="space-y-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Your memorials</h2>
              <p className="text-sm text-muted-foreground">
                Continue editing, publish drafts, and share with friends and family.
              </p>
            </div>

            {loadingMemorials ? (
              <Card className="rounded-2xl border bg-background shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-sm text-muted-foreground">Loading memorials...</p>
                </CardContent>
              </Card>
            ) : memorials.length === 0 ? (
              <Card className="rounded-2xl border bg-background shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 gap-6">
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
                </CardContent>
              </Card>
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
          </section>

          <section id="tasks" className="space-y-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Next steps</h2>
              <p className="text-sm text-muted-foreground">
                Recommended actions to get your memorials ready for visitors.
              </p>
            </div>
            {nextSteps.length === 0 ? (
              <Card className="rounded-2xl border bg-background">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No next steps available.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {nextSteps.map((step) => (
                <Card key={step.id} className="rounded-2xl border bg-background">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                    <div className="rounded-full bg-muted p-2">{renderStepStatusIcon(step.status)}</div>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button
                      variant="secondary"
                      className="w-full justify-between"
                      onClick={() => navigate(step.cta.to)}
                    >
                      {step.cta.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              </div>
            )}
          </section>

          <section id="activity" className="space-y-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Recent activity</h2>
              <p className="text-sm text-muted-foreground">
                Keep track of edits, submissions, and billing updates across your account.
              </p>
            </div>
            <Card className="rounded-2xl border bg-background">
              <CardContent className="divide-y px-0">
                {activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                  </div>
                ) : (
                  activity.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
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
                      {item.category === "system" && "System"}
                    </Badge>
                  </div>
                ))
                )}
              </CardContent>
            </Card>
          </section>

          <section id="billing" className="space-y-5 pb-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Plan & billing</h2>
              <p className="text-sm text-muted-foreground">
                Manage your subscription, invoices, and plan upgrades.
              </p>
            </div>
            <Card className="rounded-2xl border bg-background">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">No billing information available.</p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
