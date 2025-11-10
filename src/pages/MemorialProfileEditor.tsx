import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMemorialLimit } from "@/hooks/useMemorialLimit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type MockSubmission = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

type MemorialProfile = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "pending";
  dateOfBirth: string;
  dateOfDeath: string;
  theme: {
    primary: string;
    accent: string;
    background: string;
  };
  biography: string;
  heroUrl?: string;
  avatarUrl?: string;
  gallery: Array<{ id: string; url: string; alt: string }>;
  submissions: MockSubmission[];
};

const useMockProfile = (id: string | undefined): MemorialProfile | null => {
  const profiles = useMemo<MemorialProfile[]>(
    () => [
      {
        id: "mem-1",
        name: "Maria Lopez",
        slug: "maria-lopez",
        status: "draft",
        dateOfBirth: "1951-03-22",
        dateOfDeath: "2022-11-09",
        biography:
          "Maria was a devoted friend and an inspiring mentor. She loved gardening, Sunday dinners with family, and capturing small moments with her camera.",
        heroUrl: "",
        avatarUrl: "",
        theme: {
          primary: "#8b5cf6",
          accent: "#f59e0b",
          background: "#fdf8f5",
        },
        gallery: [
          { id: "g1", url: "/placeholder.svg?height=160&width=160", alt: "Maria in the garden" },
          { id: "g2", url: "/placeholder.svg?height=160&width=160", alt: "Family dinner" },
          { id: "g3", url: "/placeholder.svg?height=160&width=160", alt: "Maria with camera" },
        ],
        submissions: [
          {
            id: "sub-1",
            name: "Emily Nguyen",
            message: "I will always remember her kindness and the way she welcomed everyone.",
            createdAt: "2025-11-04T18:05:00.000Z",
            status: "pending",
          },
          {
            id: "sub-2",
            name: "Carlos Ramirez",
            message: "She taught me that little moments matter. Forever grateful.",
            createdAt: "2025-11-02T11:30:00.000Z",
            status: "approved",
          },
        ],
      },
      {
        id: "mem-2",
        name: "Jonathan “Jon” Mitchell",
        slug: "jonathan-mitchell",
        status: "published",
        dateOfBirth: "1968-08-13",
        dateOfDeath: "2024-02-05",
        biography: "Jon was an avid cyclist and a community volunteer, always the first to help neighbors.",
        heroUrl: "",
        avatarUrl: "",
        theme: {
          primary: "#0ea5e9",
          accent: "#22c55e",
          background: "#f1fbff",
        },
        gallery: [
          { id: "g1", url: "/placeholder.svg?height=160&width=160", alt: "Cycling at sunrise" },
          { id: "g2", url: "/placeholder.svg?height=160&width=160", alt: "Community cleanup" },
        ],
        submissions: [
          {
            id: "sub-3",
            name: "Sarah King",
            message: "Jon inspired me to start volunteering. Miss him dearly.",
            createdAt: "2025-10-30T09:05:00.000Z",
            status: "approved",
          },
        ],
      },
      {
        id: "mem-3",
        name: "Amelia Carter",
        slug: "amelia-carter",
        status: "pending",
        dateOfBirth: "1974-04-02",
        dateOfDeath: "2023-12-28",
        biography: "Amelia lit up every room with her sense of humor and boundless curiosity.",
        heroUrl: "",
        avatarUrl: "",
        theme: {
          primary: "#ef4444",
          accent: "#f97316",
          background: "#fff7ed",
        },
        gallery: [{ id: "g1", url: "/placeholder.svg?height=160&width=160", alt: "Amelia traveling" }],
        submissions: [],
      },
    ],
    [],
  );
  if (!id) return null;
  return profiles.find((profile) => profile.id === id) ?? null;
};

const MemorialProfileEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canPublish, limitReached, publishedCount } = useMemorialLimit();

  const profile = useMockProfile(params.id);
  const [form, setForm] = useState<MemorialProfile | null>(profile);
  const [autoPublish, setAutoPublish] = useState(false);

  if (!form) {
    return (
      <div className="min-h-screen bg-muted/10 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Memorial not found</CardTitle>
              <CardDescription>The memorial you tried to edit could not be found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const handleSave = (section: string) => {
    toast({ title: "Saved", description: `${section} saved successfully.` });
  };

  const handlePublish = () => {
    // Check if this memorial is already published
    const isCurrentlyPublished = form?.status === "published";
    
    // If trying to publish a new memorial and limit reached, redirect to order
    if (!isCurrentlyPublished && limitReached) {
      toast({
        title: "Publish limit reached",
        description: "You can only publish one memorial at a time. Order another memorial to publish more.",
        variant: "destructive",
      });
      navigate("/order");
      return;
    }

    // If this is an update to an already published memorial, allow it
    if (isCurrentlyPublished) {
      handleSave("All changes");
      return;
    }

    // If limit not reached, allow publishing
    if (canPublish) {
      setForm((prev) => (prev ? { ...prev, status: "published" } : null));
      toast({
        title: "Published",
        description: "Your memorial is now live and accessible to visitors.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Editing memorial</p>
            <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
            <p className="text-sm text-muted-foreground">codeofmemory.com/memorial/{form.slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {form.status === "published" ? (
              <Badge className="bg-emerald-500/15 text-emerald-600">Published</Badge>
            ) : form.status === "pending" ? (
              <Badge className="bg-amber-500/15 text-amber-600">Pending review</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            <Button variant="outline" onClick={() => navigate(`/memorial/${form.id}`)}>
              Preview memorial
            </Button>
            {form.status === "published" ? (
              <Button onClick={() => handleSave("All changes")}>Publish updates</Button>
            ) : limitReached ? (
              <Button onClick={() => navigate("/order")}>Order to publish</Button>
            ) : (
              <Button onClick={handlePublish}>Publish memorial</Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {limitReached && form.status !== "published" && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Publish limit reached</AlertTitle>
            <AlertDescription className="mt-2">
              You have {publishedCount} published memorial(s). To publish another memorial, you&apos;ll need to order a
              new memorial package.{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-amber-700 underline dark:text-amber-400"
                onClick={() => navigate("/order")}
              >
                Order now →
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-2">
            <TabsTrigger value="details">Profile</TabsTrigger>
            <TabsTrigger value="biography">Biography</TabsTrigger>
            <TabsTrigger value="media">Gallery & Media</TabsTrigger>
            <TabsTrigger value="submissions">Guest submissions</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Profile basics</CardTitle>
                <CardDescription>Update the memorial title, URL, and key dates.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Memorial name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Public URL</Label>
                  <div className="flex rounded-md border bg-background">
                    <span className="inline-flex items-center whitespace-nowrap px-3 text-xs text-muted-foreground">
                      codeofmemory.com/memorial/
                    </span>
                    <Input
                      id="slug"
                      className="border-0 border-l"
                      value={form.slug}
                      onChange={(event) => setForm({ ...form, slug: event.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dod">Date of passing</Label>
                  <Input
                    id="dod"
                    type="date"
                    value={form.dateOfDeath}
                    onChange={(event) => setForm({ ...form, dateOfDeath: event.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Hero image</Label>
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                      {form.heroUrl ? (
                        <img src={form.heroUrl} alt="Hero" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-background" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Upload hero image
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Portrait</Label>
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border bg-muted">
                      {form.avatarUrl ? (
                        <img src={form.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-background" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Upload portrait
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Profile basics")}>Save profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="biography">
            <Card>
              <CardHeader>
                <CardTitle>Biography</CardTitle>
                <CardDescription>
                  Craft a story, timeline, milestones, and memories. Rich text editing will be available soon.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  rows={12}
                  value={form.biography}
                  onChange={(event) => setForm({ ...form, biography: event.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: focus on anecdotes, achievements, and what made them unique. You can embed video and audio later.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Biography")}>Save biography</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Gallery & media</CardTitle>
                <CardDescription>Upload images or videos, add captions, and reorder the story.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Upload photos</Button>
                  <Button variant="outline">Upload video</Button>
                  <Button variant="ghost" className="text-muted-foreground">
                    Manage albums
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {form.gallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="h-40 w-full bg-muted">
                        <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="space-y-3 p-4">
                        <div className="space-y-2">
                          <Label htmlFor={`alt-${item.id}`}>Caption</Label>
                          <Input
                            id={`alt-${item.id}`}
                            value={item.alt}
                            onChange={(event) =>
                              setForm({
                                ...form,
                                gallery: form.gallery.map((media) =>
                                  media.id === item.id ? { ...media, alt: event.target.value } : media,
                                ),
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setForm({ ...form, gallery: form.gallery.filter((media) => media.id !== item.id) })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Gallery")}>Save gallery</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Guest submissions</CardTitle>
                <CardDescription>Review, approve, or reject guest memories before they appear publicly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No submissions yet.</p>
                ) : (
                  form.submissions.map((submission) => (
                    <div key={submission.id} className="rounded-xl border bg-background p-4 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium">{submission.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{submission.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    submissions: form.submissions.map((item) =>
                                      item.id === submission.id ? { ...item, status: "approved" } : item,
                                    ),
                                  })
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    submissions: form.submissions.map((item) =>
                                      item.id === submission.id ? { ...item, status: "rejected" } : item,
                                    ),
                                  })
                                }
                              >
                                Reject
                              </Button>
                            </>
                          ) : submission.status === "approved" ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600">Approved</Badge>
                          ) : (
                            <Badge className="bg-rose-500/15 text-rose-600">Rejected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Switch id="auto-publish" checked={autoPublish} onCheckedChange={setAutoPublish} />
                  <Label htmlFor="auto-publish" className="text-sm font-medium">
                    Auto-approve trusted guests
                  </Label>
                </div>
                <Button onClick={() => handleSave("Submissions settings")}>Save moderation settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme & appearance</CardTitle>
                <CardDescription>Customize colors to match the memorial plaque or family preferences.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 rounded-xl border bg-background p-4">
                  <Label htmlFor="primary-color">Primary color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primary-color"
                      type="color"
                      value={form.theme.primary}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, primary: event.target.value },
                        })
                      }
                    />
                    <Input
                      value={form.theme.primary}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, primary: event.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 rounded-xl border bg-background p-4">
                  <Label htmlFor="accent-color">Accent color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="accent-color"
                      type="color"
                      value={form.theme.accent}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, accent: event.target.value },
                        })
                      }
                    />
                    <Input
                      value={form.theme.accent}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, accent: event.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 rounded-xl border bg-background p-4 md:col-span-2">
                  <Label htmlFor="background-color">Background</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="background-color"
                      type="color"
                      value={form.theme.background}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, background: event.target.value },
                        })
                      }
                    />
                    <Input
                      value={form.theme.background}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          theme: { ...form.theme, background: event.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Preview</h3>
                  <div className="mt-3 rounded-xl border bg-background p-6 shadow-inner">
                    <div
                      className="rounded-xl p-6 text-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${form.theme.primary}, ${form.theme.accent})`,
                      }}
                    >
                      <div className="mx-auto h-16 w-16 rounded-full border-2 border-white/40 bg-white/30" />
                      <h4 className="mt-3 text-lg font-semibold">{form.name}</h4>
                      <p className="text-sm">
                        {new Date(form.dateOfBirth).getFullYear()} – {new Date(form.dateOfDeath).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Theme settings")}>Save theme</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Need help?</h2>
            <p className="text-sm text-muted-foreground">
              Export the memorial for offline backup or contact support for layout assistance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">Export memorial</Button>
            <Button variant="ghost">Contact support</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialProfileEditor;


