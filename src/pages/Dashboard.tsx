import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, ListChecks, History, CreditCard, ArrowUpRight, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMemorialLimit } from "@/hooks/useMemorialLimit";

type MemorialSummary = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "pending";
  updatedAt: string;
  progress: number;
  pendingSubmissions: number;
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

  const memorials = useMemo<MemorialSummary[]>(
    () => [
      {
        id: "mem-1",
        title: "Maria Lopez",
        slug: "maria-lopez",
        status: "draft",
        updatedAt: "2025-11-04T15:32:00.000Z",
        progress: 65,
        pendingSubmissions: 2,
      },
    ],
    [],
  );

  const nextSteps = useMemo<NextStep[]>(
    () => [
      {
        id: "step-1",
        title: "Upload gallery media",
        description: "Add photos that capture their story. Organize them in the order you want guests to see.",
        cta: { label: "Go to Media Library", to: "/dashboard?section=media" },
        status: "ready",
      },
      {
        id: "step-2",
        title: "Finalize biography",
        description: "Polish the biography and include key milestones or anecdotes you want visitors to remember.",
        cta: { label: "Edit biography", to: "/dashboard?section=bio" },
        status: "in-progress",
      },
      {
        id: "step-3",
        title: "Review guest submissions",
        description: "Approve the memories that friends and family have shared so they appear publicly.",
        cta: { label: "Open submissions", to: "/dashboard?section=submissions" },
        status: "blocked",
      },
    ],
    [],
  );

  const activity = useMemo<ActivityItem[]>(
    () => [
      {
        id: "feed-1",
        timestamp: "2025-11-04T18:05:00.000Z",
        description: "Emily Nguyen submitted a memory with a photo for Maria Lopez.",
        category: "submission",
      },
      {
        id: "feed-2",
        timestamp: "2025-11-03T12:22:00.000Z",
        description: "You updated the biography for Maria Lopez's memorial.",
        category: "update",
      },
      {
        id: "feed-3",
        timestamp: "2025-11-02T09:48:00.000Z",
        description: "Payment for Memorial Plan • Pro was processed successfully.",
        category: "system",
      },
    ],
    [],
  );

  const [activeSection, setActiveSection] = useState<string>("overview");

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
  const pendingSubmissions = memorials.reduce((acc, mem) => acc + mem.pendingSubmissions, 0);

  const stats = [
    {
      label: "Memorials",
      value: `${totalMemorials}`,
      helper: `${publishedMemorials} published`,
    },
    {
      label: "Pending submissions",
      value: `${pendingSubmissions}`,
      helper: "Awaiting review",
    },
    {
      label: "Storage",
      value: "2.1 GB",
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
                  <Button asChild>
                    <Link to="/onboarding">
                      Resume onboarding
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your memorials</h2>
                <p className="text-sm text-muted-foreground">
                  Continue editing, publish drafts, and share with friends and family.
                </p>
              </div>
              <Button
                onClick={() => {
                  if (limitReached) {
                    toast({
                      title: "Publish limit reached",
                      description: "You can only publish one memorial at a time. Order another memorial to publish more.",
                      variant: "destructive",
                    });
                    navigate("/order");
                  } else {
                    toast({
                      title: "Create memorial",
                      description: "Memorial creation flow is coming soon.",
                    });
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New memorial
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {memorials.map((memorial) => (
                <Card key={memorial.id} className="flex flex-col justify-between rounded-2xl border bg-background shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg font-semibold">{memorial.title}</CardTitle>
                      {renderStatusBadge(memorial.status)}
                    </div>
                    <CardDescription>codeofmemory.com/memorial/{memorial.slug}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Build progress</span>
                        <span>{memorial.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-[width]"
                          style={{ width: `${memorial.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Updated {new Date(memorial.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                      {memorial.pendingSubmissions > 0 ? (
                        <span className="font-medium text-amber-500">
                          {memorial.pendingSubmissions} pending submission{memorial.pendingSubmissions > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span>No pending submissions</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/50 p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/memorial/${memorial.id}`)}
                    >
                      Preview
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/memorial/${memorial.id}/edit`)}>
                      Edit memorial
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section id="tasks" className="space-y-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Next steps</h2>
              <p className="text-sm text-muted-foreground">
                Recommended actions to get your memorials ready for visitors.
              </p>
            </div>
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
                {activity.map((item, index) => (
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
                ))}
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
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Memorial Plan • Pro</CardTitle>
                  <CardDescription>
                    Renewal on {new Date("2026-01-15T12:00:00.000Z").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </CardDescription>
                </div>
                <Badge className="w-fit bg-emerald-500/15 text-emerald-600">Active</Badge>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div>
                  <p className="font-medium text-foreground">Included</p>
                  <p>1 memorial, 1 QR code, 10 GB media, visitor submissions</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Next invoice</p>
                  <p>$149/year</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Payment method</p>
                  <p>Visa ending in •••• 4242</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 border-t bg-muted/40 p-4 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => navigate("/payment")}>
                  Update payment method
                </Button>
                <Button onClick={() => navigate("/payment")}>
                  View invoices
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
