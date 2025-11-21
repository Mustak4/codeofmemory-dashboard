import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type GuestBookEntry = {
  id: string;
  guest_name: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type MemorialDetailData = {
  id: string;
  name: string;
  slug: string;
  dateOfBirth: string; // ISO
  dateOfDeath: string; // ISO
  status: "draft" | "published" | "pending";
  biographyHtml: string;
  gallery: Array<{ id: string; url: string; alt: string }>;
  family?: {
    parents?: string[];
    spouses?: string[];
    children?: string[];
    siblings?: string[];
    grandchildren?: string | string[];
  };
  avatarUrl?: string;
  heroUrl?: string;
};


const MemorialDetail = () => {
  const params = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [memorial, setMemorial] = useState<MemorialDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestBookEntries, setGuestBookEntries] = useState<GuestBookEntry[]>([]);

  useEffect(() => {
    const loadMemorial = async () => {
      if (!params.id && !params.slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let query = supabase.from("memorials").select("*");

        // Check if the param looks like a UUID (ID) or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          params.id || params.slug || ""
        );

        if (params.id || (params.slug && isUUID)) {
          // If we have an ID (or slug that's actually a UUID), use it
          const id = params.id || params.slug;
          query = query.eq("id", id);
          // If user is authenticated, they can view their own drafts
          if (user) {
            query = query.or(`user_id.eq.${user.id},status.eq.published`);
          } else {
            query = query.eq("status", "published");
          }
        } else if (params.slug) {
          // If we have a slug (not a UUID), use it for public access
          query = query.eq("slug", params.slug).eq("status", "published");
        }

        const { data, error } = await query.single();

        if (error) throw error;

        if (data) {
          // Load gallery items
          const { data: galleryData } = await supabase
            .from("gallery_items")
            .select("*")
            .eq("memorial_id", data.id)
            .order("order", { ascending: true });

          // Load family members
          const { data: familyData } = await supabase
            .from("family_members")
            .select("*")
            .eq("memorial_id", data.id);

          // Load approved guestbook entries
          const { data: guestbookData } = await supabase
            .from("guestbook_entries")
            .select("*")
            .eq("memorial_id", data.id)
            .eq("status", "approved")
            .order("created_at", { ascending: false });

          if (guestbookData) {
            setGuestBookEntries(guestbookData);
          }

          // Transform family members into grouped format
          const familyMembers = (familyData || []).reduce(
            (acc, member) => {
              const name = member.name;
              switch (member.relationship) {
                case "parent":
                  acc.parents = acc.parents || [];
                  acc.parents.push(name);
                  break;
                case "spouse":
                  acc.spouses = acc.spouses || [];
                  acc.spouses.push(name);
                  break;
                case "child":
                  acc.children = acc.children || [];
                  acc.children.push(name);
                  break;
                case "sibling":
                  acc.siblings = acc.siblings || [];
                  acc.siblings.push(name);
                  break;
                case "grandchild":
                  acc.grandchildren = acc.grandchildren || [];
                  acc.grandchildren.push(name);
                  break;
              }
              return acc;
            },
            {} as {
              parents?: string[];
              spouses?: string[];
              children?: string[];
              siblings?: string[];
              grandchildren?: string[];
            }
          );

          setMemorial({
            id: data.id,
            name: data.name || "",
            slug: data.slug || "",
            dateOfBirth: data.date_of_birth || "",
            dateOfDeath: data.date_of_death || "",
            status: data.status || "draft",
            biographyHtml: data.biography_html || "",
            heroUrl: data.hero_url || undefined,
            avatarUrl: data.avatar_url || undefined,
            gallery: (galleryData || []).map((item) => ({
              id: item.id,
              url: item.url,
              alt: item.alt || "",
            })),
            family: Object.keys(familyMembers).length > 0 ? familyMembers : undefined,
          });
        }
      } catch (error) {
        console.error("Error loading memorial:", error);
        // Don't show error toast for public access - just show not found
      } finally {
        setLoading(false);
      }
    };

    loadMemorial();
  }, [params.id, params.slug, user]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Loading memorial...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Memorial not found</CardTitle>
              <CardDescription>
                {params.slug 
                  ? "This memorial does not exist or is not published yet." 
                  : "The memorial you are looking for does not exist."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
              ) : (
                <Button onClick={() => navigate("/signin")}>Sign in</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Hero */}
      <div className="relative h-56 w-full overflow-visible rounded-b-3xl border-b bg-muted/40">
        {memorial.heroUrl ? (
          <img src={memorial.heroUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-muted to-background" />
        )}
        {/* Circular avatar positioned over the cover */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-background shadow-md sm:h-32 sm:w-32">
            <img src={memorial.avatarUrl ?? "/logo.png"} alt={memorial.name} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-12">
        {/* Header with name, dates, status + actions */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{memorial.name}</h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Born {formatDate(memorial.dateOfBirth)} · Died {formatDate(memorial.dateOfDeath)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">codeofmemory.com/memorial/{memorial.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            {memorial.status === "published" ? (
              <Badge className="bg-emerald-500/15 text-emerald-600">Published</Badge>
            ) : memorial.status === "pending" ? (
              <Badge className="bg-amber-500/15 text-amber-600">Pending Review</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {user && (
              <Button variant="outline" onClick={() => navigate(`/memorial/${memorial.id}/edit`)}>
                Edit memorial
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="bio" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bio">Biography</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="guestbook">Guest Book</TabsTrigger>
            </TabsList>

            <TabsContent value="bio" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                  <CardDescription>Tell their story in their words.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-neutral max-w-none dark:prose-invert whitespace-pre-wrap"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {memorial.biographyHtml || "No biography added yet."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                  <CardDescription>Photos and videos that capture their life.</CardDescription>
                </CardHeader>
                <CardContent>
                  {memorial.gallery.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No images yet.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {memorial.gallery.map((img) => (
                        <button
                          key={img.id}
                          className="group overflow-hidden rounded-xl border bg-background"
                          onClick={() => toast({ title: "Lightbox", description: "Opens full-screen viewer (soon)" })}
                        >
                          <img src={img.url} alt={img.alt} className="h-44 w-full object-cover transition group-hover:scale-105" />
                          <p className="truncate px-3 py-2 text-xs text-muted-foreground">{img.alt}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Upload media",
                          description: "Media uploader will be added in the next step.",
                        })
                      }
                    >
                      Upload images
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family</CardTitle>
                  <CardDescription>Those who shaped and shared their life.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold">Parents</h3>
                      <Separator className="my-2" />
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(memorial.family?.parents ?? []).map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                        {!(memorial.family?.parents ?? []).length && <li>—</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Spouse(s)</h3>
                      <Separator className="my-2" />
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(memorial.family?.spouses ?? []).map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                        {!(memorial.family?.spouses ?? []).length && <li>—</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Children</h3>
                      <Separator className="my-2" />
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(memorial.family?.children ?? []).map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                        {!(memorial.family?.children ?? []).length && <li>—</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Grandchildren</h3>
                      <Separator className="my-2" />
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {Array.isArray(memorial.family?.grandchildren)
                          ? memorial.family?.grandchildren.map((p) => <li key={p}>{p}</li>)
                          : memorial.family?.grandchildren ?? "—"}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-semibold">Siblings</h3>
                      <Separator className="my-2" />
                      <ul className="columns-2 gap-6 text-sm text-muted-foreground md:columns-3">
                        {(memorial.family?.siblings ?? []).map((p) => (
                          <li key={p} className="break-inside-avoid">
                            {p}
                          </li>
                        ))}
                        {!(memorial.family?.siblings ?? []).length && <li>—</li>}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guestbook" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Book</CardTitle>
                  <CardDescription>Messages and memories shared by visitors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Display approved entries */}
                  {guestBookEntries.length > 0 ? (
                    <div className="space-y-4">
                      {guestBookEntries.map((entry) => (
                        <div key={entry.id} className="rounded-lg border bg-background p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium text-sm">{entry.guest_name}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                {entry.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No messages yet. Be the first to share a memory.</p>
                    </div>
                  )}

                  {/* Separator */}
                  {guestBookEntries.length > 0 && (
                    <Separator className="my-6" />
                  )}

                  {/* Submission form */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Add a message</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share a memory or message. Entries are publicly visible after approval.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="guest-name">
                          Your name
                        </label>
                        <Input
                          id="guest-name"
                          placeholder="Name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="guest-message">
                          Message
                        </label>
                        <Textarea
                          id="guest-message"
                          placeholder="A favorite story, a message to the family, or how they impacted you."
                          rows={5}
                          value={guestMessage}
                          onChange={(e) => setGuestMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Protected by rate-limiting and moderation. Media uploads coming soon.
                      </p>
                      <Button
                        disabled={submitting || guestName.trim() === "" || guestMessage.trim() === ""}
                        onClick={async () => {
                          if (!memorial) return;
                          
                          try {
                            setSubmitting(true);
                            
                            const { error } = await supabase
                              .from("guestbook_entries")
                              .insert({
                                memorial_id: memorial.id,
                                guest_name: guestName.trim(),
                                message: guestMessage.trim(),
                                status: "pending",
                              });

                            if (error) throw error;

                            setGuestName("");
                            setGuestMessage("");
                            toast({
                              title: "Submitted",
                              description: "Your entry is awaiting approval by the memorial owner.",
                            });
                          } catch (error) {
                            console.error("Error submitting guest book entry:", error);
                            toast({
                              title: "Error",
                              description: "Failed to submit entry. Please try again.",
                              variant: "destructive",
                            });
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        {submitting ? "Submitting..." : "Submit entry"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemorialDetail;


