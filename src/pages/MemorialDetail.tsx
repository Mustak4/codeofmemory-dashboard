import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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

const useMockMemorialById = (id: string | undefined): MemorialDetailData | null => {
  const all = useMemo<MemorialDetailData[]>(
    () => [
      {
        id: "mem-1",
        name: "Maria Lopez",
        slug: "maria-lopez",
        dateOfBirth: "1951-03-22",
        dateOfDeath: "2022-11-09",
        status: "draft",
        biographyHtml:
          "<p>Maria was a devoted friend and an inspiring mentor. She loved gardening, Sunday dinners with family, and capturing small moments with her camera.</p><p>Her story is one of kindness, perseverance, and joy shared generously with everyone she met.</p>",
        gallery: [
          { id: "g1", url: "/placeholder.svg", alt: "Maria in the garden" },
          { id: "g2", url: "/placeholder.svg", alt: "Family dinner" },
          { id: "g3", url: "/placeholder.svg", alt: "Maria with camera" },
        ],
        family: {
          parents: ["Lucia Alvarez", "Jorge Lopez"],
          spouses: ["Carlos Ramirez"],
          children: ["Ana Lopez", "Diego Lopez"],
          siblings: ["Isabella Cruz", "Miguel Lopez"],
          grandchildren: "5 grandchildren",
        },
        avatarUrl: "/logo.png",
        heroUrl: "/src/assets/hero-background.jpg",
      },
      {
        id: "mem-2",
        name: "Jonathan “Jon” Mitchell",
        slug: "jonathan-mitchell",
        dateOfBirth: "1968-08-13",
        dateOfDeath: "2024-02-05",
        status: "published",
        biographyHtml:
          "<p>Jon was an avid cyclist and a community volunteer. He believed deeply in the power of neighbors helping neighbors.</p>",
        gallery: [
          { id: "g1", url: "/placeholder.svg", alt: "Riding at sunrise" },
          { id: "g2", url: "/placeholder.svg", alt: "Community event" },
        ],
        family: {
          parents: ["Paul Mitchell", "Sandra Mitchell"],
          spouses: ["Rachel Mitchell"],
          children: ["Noah Mitchell"],
          siblings: ["Sarah King"],
        },
        avatarUrl: "/logo.png",
        heroUrl: "/src/assets/hero-background.jpg",
      },
      {
        id: "mem-3",
        name: "Amelia Carter",
        slug: "amelia-carter",
        dateOfBirth: "1974-04-02",
        dateOfDeath: "2023-12-28",
        status: "pending",
        biographyHtml:
          "<p>Amelia lit up every room with her sense of humor and boundless curiosity. She cherished travel and learning new languages.</p>",
        gallery: [{ id: "g1", url: "/placeholder.svg", alt: "Amelia traveling" }],
        family: {
          spouses: ["Jamie Carter"],
          siblings: ["Mark Carter", "Jenna Carter"],
        },
        avatarUrl: "/logo.png",
        heroUrl: "/src/assets/hero-background.jpg",
      },
    ],
    [],
  );

  if (!id) return null;
  return all.find((m) => m.id === id) ?? null;
};

const MemorialDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const memorial = useMockMemorialById(params.id);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!memorial) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Memorial not found</CardTitle>
              <CardDescription>The memorial you are looking for does not exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
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
      <div className="relative h-56 w-full overflow-hidden rounded-b-3xl border-b bg-muted/40">
        {memorial.heroUrl ? (
          <img src={memorial.heroUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-muted to-background" />
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-12">
        {/* Header with avatar, name, dates, status + actions */}
        <div className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-background shadow-md sm:h-32 sm:w-32">
            <img src={memorial.avatarUrl ?? "/logo.png"} alt={memorial.name} className="h-full w-full object-cover" />
          </div>
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
            <Button variant="outline" onClick={() => navigate(`/memorial/${memorial.id}/edit`)}>
              Edit memorial
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Publish flow",
                  description: "Publishing controls will be added soon.",
                })
              }
            >
              Publish
            </Button>
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
                    className="prose prose-neutral max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: memorial.biographyHtml }}
                  />
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
                  <CardDescription>Share a memory or message. Entries are publicly visible after approval.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        try {
                          setSubmitting(true);
                          await new Promise((r) => setTimeout(r, 600));
                          setGuestName("");
                          setGuestMessage("");
                          toast({
                            title: "Submitted",
                            description: "Your entry is awaiting approval by the memorial owner.",
                          });
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit entry"}
                    </Button>
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


