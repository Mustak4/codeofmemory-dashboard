import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useMemorialLimit } from "@/hooks/useMemorialLimit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarIcon, Upload, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Submission = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

type FamilyMember = {
  id: string;
  name: string;
  relationship: "parent" | "spouse" | "child" | "sibling" | "grandchild";
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
  family: FamilyMember[];
  submissions: Submission[];
};

// Helper function to format date for display (MM/DD/YYYY)
const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return "";
  }
};


const MemorialProfileEditor = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canPublish, limitReached, publishedCount } = useMemorialLimit();
  const { user } = useAuth();
  
  // File input refs
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const galleryVideoInputRef = useRef<HTMLInputElement>(null);
  
  // Upload loading states
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const isCreating = location.pathname === "/create-memorial";
  const memorialId = params.id;
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  // Initialize form for new memorial creation
  const [form, setForm] = useState<MemorialProfile | null>(() => {
    if (isCreating) {
      // Initialize with default values for a new memorial
      return {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        name: "",
        slug: "",
        status: "draft",
        dateOfBirth: "",
        dateOfDeath: "",
        biography: "",
        heroUrl: "",
        avatarUrl: "",
        theme: {
          primary: "#8b5cf6",
          accent: "#f59e0b",
          background: "#fdf8f5",
        },
        gallery: [],
        family: [],
        submissions: [],
      };
    }
    return null;
  });
  const [autoPublish, setAutoPublish] = useState(false);
  const [loading, setLoading] = useState(!isCreating);
  
  // State for step-by-step date picker
  const [datePickerOpen, setDatePickerOpen] = useState<"birth" | "death" | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  
  // Convert ISO date string to Date object for calendar (avoid timezone issues)
  const getDateFromISO = (isoDate: string): Date | undefined => {
    if (!isoDate) return undefined;
    // Parse YYYY-MM-DD format directly to avoid timezone shifts
    const [year, month, day] = isoDate.split("-").map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? undefined : date;
  };
  
  // Convert Date object to ISO string (YYYY-MM-DD) without timezone issues
  const dateToISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  // Initialize date picker state when opening
  const handleDatePickerOpen = (type: "birth" | "death") => {
    setDatePickerOpen(type);
    const currentDate = type === "birth" ? form.dateOfBirth : form.dateOfDeath;
    if (currentDate) {
      const [year, month] = currentDate.split("-").map(Number);
      setSelectedYear(year);
      setSelectedMonth(month);
    } else {
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  };
  
  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };
  
  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };
  
  // Handle day selection
  const handleDaySelect = (day: number) => {
    if (selectedYear && selectedMonth) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const isoDate = dateToISOString(date);
      if (datePickerOpen === "birth") {
        setForm({ ...form, dateOfBirth: isoDate });
      } else {
        setForm({ ...form, dateOfDeath: isoDate });
      }
      setDatePickerOpen(null);
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  };
  
  // Generate years list
  const years = Array.from({ length: new Date().getFullYear() + 10 - 1900 + 1 }, (_, i) => 1900 + i).reverse();
  
  // Months list
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };

  // Helper function to create a safe folder name from memorial name
  const getMemorialFolderName = (memorialName: string): string => {
    if (!memorialName) return "untitled";
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    return memorialName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Helper function to generate slug from name
  const generateSlug = (name: string): string => {
    if (!name) return "";
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 50); // Limit length
  };

  // Upload image or video to Supabase Storage with organized folder structure
  const uploadImage = async (
    file: File,
    type: "hero" | "portrait" | "gallery-image" | "gallery-video" | "commented-image" | "commented-video"
  ): Promise<string | null> => {
    if (!user || !form || !form.name) {
      toast({
        title: "Error",
        description: "Please enter a memorial name before uploading files.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file",
        description: "Please select an image or video file.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 50MB for videos, 5MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: isVideo 
          ? "Video must be less than 50MB." 
          : "Image must be less than 5MB.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Get folder name from memorial name (e.g., "Kristian")
      const memorialFolder = getMemorialFolderName(form.name);
      
      // Determine subfolder based on type
      let subFolder: string;
      if (type === "hero" || type === "portrait") {
        subFolder = "Main images";
      } else if (type === "gallery-image") {
        subFolder = "Main images";
      } else if (type === "commented-image") {
        subFolder = "Commented Images";
      } else if (type === "gallery-video") {
        subFolder = "Main Videos";
      } else if (type === "commented-video") {
        subFolder = "Commented Videos";
      } else {
        subFolder = "Main images";
      }
      
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = type === "hero" 
        ? `hero-${timestamp}.${fileExt}`
        : type === "portrait"
        ? `portrait-${timestamp}.${fileExt}`
        : `${type}-${timestamp}.${fileExt}`;
      
      // Full path: {memorial-name}/{subfolder}/{filename}
      // Example: "kristian/Main images/hero-1234567890.jpg"
      const filePath = `${memorialFolder}/${subFolder}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("memorial-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("memorial-images").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle hero image upload
  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingHero(true);
    const url = await uploadImage(file, "hero");
    if (url) {
      setForm({ ...form, heroUrl: url });
      toast({
        title: "Image uploaded",
        description: "Hero image uploaded successfully.",
      });
    }
    setUploadingHero(false);
    
    // Reset input
    if (heroImageInputRef.current) {
      heroImageInputRef.current.value = "";
    }
  };

  // Handle portrait upload
  const handlePortraitUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPortrait(true);
    const url = await uploadImage(file, "portrait");
    if (url) {
      setForm({ ...form, avatarUrl: url });
      toast({
        title: "Image uploaded",
        description: "Portrait uploaded successfully.",
      });
    }
    setUploadingPortrait(false);
    
    // Reset input
    if (portraitInputRef.current) {
      portraitInputRef.current.value = "";
    }
  };

  // Remove hero image
  const handleRemoveHeroImage = () => {
    setForm({ ...form, heroUrl: "" });
    toast({
      title: "Image removed",
      description: "Hero image has been removed.",
    });
  };

  // Remove portrait
  const handleRemovePortrait = () => {
    setForm({ ...form, avatarUrl: "" });
    toast({
      title: "Image removed",
      description: "Portrait has been removed.",
    });
  };

  // Handle gallery image upload
  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const uploadedItems: Array<{ id: string; url: string; alt: string }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImage(file, "gallery-image");
        if (url) {
          uploadedItems.push({
            id: crypto?.randomUUID?.() ?? String(Date.now() + i),
            url,
            alt: "",
          });
        }
      }

      if (uploadedItems.length > 0) {
        setForm({
          ...form,
          gallery: [...form.gallery, ...uploadedItems],
        });
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${uploadedItems.length} image${uploadedItems.length > 1 ? "s" : ""}.`,
        });
      }
    } finally {
      setUploadingGallery(false);
      // Reset input
      if (galleryImageInputRef.current) {
        galleryImageInputRef.current.value = "";
      }
    }
  };

  // Handle gallery video upload
  const handleGalleryVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const url = await uploadImage(file, "gallery-video");
      if (url) {
        setForm({
          ...form,
          gallery: [
            ...form.gallery,
            {
              id: crypto?.randomUUID?.() ?? String(Date.now()),
              url,
              alt: "",
            },
          ],
        });
        toast({
          title: "Video uploaded",
          description: "Video uploaded successfully.",
        });
      }
    } finally {
      setUploadingGallery(false);
      // Reset input
      if (galleryVideoInputRef.current) {
        galleryVideoInputRef.current.value = "";
      }
    }
  };

  // Fetch memorial data from Supabase when editing existing memorial
  useEffect(() => {
    const loadMemorial = async () => {
      if (!isCreating && memorialId && user) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("memorials")
            .select("*")
            .eq("id", memorialId)
            .eq("user_id", user.id)
            .single();

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

            // Load guestbook entries (submissions)
            const { data: submissionsData } = await supabase
              .from("guestbook_entries")
              .select("*")
              .eq("memorial_id", data.id)
              .order("created_at", { ascending: false });

            setForm({
              id: data.id,
              name: data.name || "",
              slug: data.slug || "",
              status: data.status || "draft",
              dateOfBirth: data.date_of_birth || "",
              dateOfDeath: data.date_of_death || "",
              biography: data.biography_html || "",
              heroUrl: data.hero_url || "",
              avatarUrl: data.avatar_url || "",
              theme: {
                primary: "#8b5cf6",
                accent: "#f59e0b",
                background: "#fdf8f5",
              },
              gallery: (galleryData || []).map((item) => ({
                id: item.id,
                url: item.url,
                alt: item.alt || "",
              })),
              family: (familyData || []).map((item) => ({
                id: item.id,
                name: item.name,
                relationship: item.relationship,
              })),
              submissions: (submissionsData || []).map((item) => ({
                id: item.id,
                name: item.guest_name,
                message: item.message,
                status: item.status,
                createdAt: item.created_at,
              })),
            });
            setHasBeenSaved(true);
          }
        } catch (error) {
          console.error("Error loading memorial:", error);
          toast({
            title: "Error",
            description: "Failed to load memorial. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadMemorial();
  }, [isCreating, memorialId, user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/10 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Loading memorial data...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!form && !isCreating) {
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

  if (!form) {
    return null; // Should not happen, but TypeScript guard
  }

  const handleSave = async (section: string) => {
    if (!form || !user) {
      toast({
        title: "Error",
        description: "Unable to save. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!form.name) {
      toast({
        title: "Validation error",
        description: "Please fill in the memorial name before saving.",
        variant: "destructive",
      });
      return;
    }

    // Auto-generate slug if missing
    const finalSlug = form.slug || generateSlug(form.name);
    if (!finalSlug) {
      toast({
        title: "Validation error",
        description: "Unable to generate a valid URL slug. Please check the memorial name.",
        variant: "destructive",
      });
      return;
    }

    // Only require dates when creating a new memorial (not when just saving gallery)
    const shouldCreate = isCreating && !hasBeenSaved;
    if (shouldCreate && (!form.dateOfBirth || !form.dateOfDeath)) {
      toast({
        title: "Validation error",
        description: "Please select both date of birth and date of passing before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if this is a new memorial that hasn't been saved yet
      const shouldCreate = isCreating && !hasBeenSaved;

      if (shouldCreate) {
        // Create new memorial in database
        const { data, error } = await supabase
          .from("memorials")
          .insert({
            id: form.id,
            user_id: user.id,
            name: form.name,
            slug: finalSlug,
            date_of_birth: form.dateOfBirth,
            date_of_death: form.dateOfDeath,
            status: form.status,
            biography_html: form.biography,
            avatar_url: form.avatarUrl || null,
            hero_url: form.heroUrl || null,
          })
          .select()
          .single();

        if (error) throw error;

          // Save gallery items if any (for new memorials)
          if (form.gallery.length > 0) {
            const { error: galleryError } = await supabase
              .from("gallery_items")
              .insert(
                form.gallery.map((item, index) => ({
                  memorial_id: form.id,
                  url: item.url,
                  alt: item.alt || "",
                  order: index,
                }))
              );

            if (galleryError) throw galleryError;
          }

          // Save family members if any (for new memorials)
          if (form.family.length > 0) {
            const { error: familyError } = await supabase
              .from("family_members")
              .insert(
                form.family.map((item) => ({
                  memorial_id: form.id,
                  name: item.name,
                  relationship: item.relationship,
                }))
              );

            if (familyError) throw familyError;
          }

        // Update form with saved data and mark as saved
        setForm({ ...form, slug: finalSlug });
        setHasBeenSaved(true);
        navigate(`/memorial/${form.id}/edit`, { replace: true });

        toast({ 
          title: "Saved", 
          description: `${section} saved successfully.` 
        });
      } else {
        // Update existing memorial
        const { error } = await supabase
          .from("memorials")
          .update({
            name: form.name,
            slug: finalSlug,
            date_of_birth: form.dateOfBirth,
            date_of_death: form.dateOfDeath,
            status: form.status,
            biography_html: form.biography,
            avatar_url: form.avatarUrl || null,
            hero_url: form.heroUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", form.id)
          .eq("user_id", user.id);

        if (error) throw error;

        // If saving gallery, update gallery items
        if (section === "Gallery") {
          // Delete existing gallery items
          await supabase
            .from("gallery_items")
            .delete()
            .eq("memorial_id", form.id);

          // Insert new gallery items
          if (form.gallery.length > 0) {
            const { error: galleryError } = await supabase
              .from("gallery_items")
              .insert(
                form.gallery.map((item, index) => ({
                  memorial_id: form.id,
                  url: item.url,
                  alt: item.alt || "",
                  order: index,
                }))
              );

            if (galleryError) throw galleryError;
          }
        }

        // If saving family, update family members
        if (section === "Family") {
          // Delete existing family members
          await supabase
            .from("family_members")
            .delete()
            .eq("memorial_id", form.id);

          // Insert new family members
          if (form.family.length > 0) {
            const { error: familyError } = await supabase
              .from("family_members")
              .insert(
                form.family.map((item) => ({
                  memorial_id: form.id,
                  name: item.name,
                  relationship: item.relationship,
                }))
              );

            if (familyError) throw familyError;
          }
        }

        // If saving submissions, update guestbook entry statuses
        if (section === "Submissions settings") {
          // Update each submission status
          for (const submission of form.submissions) {
            const { error } = await supabase
              .from("guestbook_entries")
              .update({ status: submission.status })
              .eq("id", submission.id)
              .eq("memorial_id", form.id);

            if (error) throw error;
          }
        }

        toast({ 
          title: "Saved", 
          description: `${section} saved successfully.` 
        });
      }
    } catch (error) {
      console.error("Error saving memorial:", error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    if (!form || !user) {
      toast({
        title: "Error",
        description: "Unable to publish. Please try again.",
        variant: "destructive",
      });
      return;
    }

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

    // Validate required fields before publishing
    if (!form.name) {
      toast({
        title: "Validation error",
        description: "Please fill in the memorial name before publishing.",
        variant: "destructive",
      });
      return;
    }

    const finalSlug = form.slug || generateSlug(form.name);
    if (!finalSlug) {
      toast({
        title: "Validation error",
        description: "Unable to generate a valid URL slug. Please check the memorial name.",
        variant: "destructive",
      });
      return;
    }

    if (!form.dateOfBirth || !form.dateOfDeath) {
      toast({
        title: "Validation error",
        description: "Please select both date of birth and date of passing before publishing.",
        variant: "destructive",
      });
      return;
    }

    // If limit not reached, allow publishing
    if (canPublish) {
      try {
        const shouldCreate = isCreating && !hasBeenSaved;

        if (shouldCreate) {
          // Create new memorial with published status
          const { data, error } = await supabase
            .from("memorials")
            .insert({
              id: form.id,
              user_id: user.id,
              name: form.name,
              slug: finalSlug,
              date_of_birth: form.dateOfBirth,
              date_of_death: form.dateOfDeath,
              status: "published",
              biography_html: form.biography,
              avatar_url: form.avatarUrl || null,
              hero_url: form.heroUrl || null,
            })
            .select()
            .single();

          if (error) throw error;

          // Save gallery items if any
          if (form.gallery.length > 0) {
            const { error: galleryError } = await supabase
              .from("gallery_items")
              .insert(
                form.gallery.map((item, index) => ({
                  memorial_id: form.id,
                  url: item.url,
                  alt: item.alt || "",
                  order: index,
                }))
              );

            if (galleryError) throw galleryError;
          }

          // Update form and mark as saved
          setForm({ ...form, slug: finalSlug, status: "published" });
          setHasBeenSaved(true);
          navigate(`/memorial/${form.id}/edit`, { replace: true });
        } else {
          // Update existing memorial to published
          const { error } = await supabase
            .from("memorials")
            .update({
              status: "published",
              updated_at: new Date().toISOString(),
            })
            .eq("id", form.id)
            .eq("user_id", user.id);

          if (error) throw error;

          setForm({ ...form, status: "published" });
        }

        toast({
          title: "Published",
          description: `Your memorial is now live at codeofmemory.com/memorial/${finalSlug}`,
        });
      } catch (error) {
        console.error("Error publishing memorial:", error);
        toast({
          title: "Publish failed",
          description: error instanceof Error ? error.message : "Failed to publish memorial. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {isCreating ? "Creating memorial" : "Editing memorial"}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {form.name || "New Memorial"}
            </h1>
            {form.slug && (
              <p className="text-sm text-muted-foreground">codeofmemory.com/memorial/{form.slug}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {form.status === "published" ? (
              <Badge className="bg-emerald-500/15 text-emerald-600">Published</Badge>
            ) : form.status === "pending" ? (
              <Badge className="bg-amber-500/15 text-amber-600">Pending review</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {form.slug && (
              <Button variant="outline" onClick={() => navigate(`/memorial/${form.id}`)}>
                Preview memorial
              </Button>
            )}
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
            <TabsTrigger value="family">Family</TabsTrigger>
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
                    onChange={(event) => {
                      const newName = event.target.value;
                      // Auto-generate slug if it's empty or matches the previous name's slug
                      const newSlug = form.slug === generateSlug(form.name) || !form.slug
                        ? generateSlug(newName)
                        : form.slug;
                      setForm({ ...form, name: newName, slug: newSlug });
                    }}
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
                  <Popover open={datePickerOpen === "birth"} onOpenChange={(open) => {
                    if (open) {
                      handleDatePickerOpen("birth");
                    } else {
                      setDatePickerOpen(null);
                      setSelectedYear(null);
                      setSelectedMonth(null);
                    }
                  }}>
                    <PopoverTrigger asChild>
                      <Button
                        id="dob"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.dateOfBirth && "text-muted-foreground"
                        )}
                        onClick={() => handleDatePickerOpen("birth")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.dateOfBirth ? formatDateForDisplay(form.dateOfBirth) : <span>MM/DD/YYYY</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      {!selectedYear ? (
                        // Year selection
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium mb-3">Select Year</h3>
                          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                            {years.map((year) => (
                              <Button
                                key={year}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleYearSelect(year)}
                                className="h-8"
                              >
                                {year}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : !selectedMonth ? (
                        // Month selection
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedYear(null)}
                              className="h-8"
                            >
                              ← Back
                            </Button>
                            <h3 className="text-sm font-medium">Select Month</h3>
                            <div className="w-16" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {months.map((month, index) => (
                              <Button
                                key={month}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMonthSelect(index + 1)}
                                className="h-10"
                              >
                                {month}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Day selection
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMonth(null)}
                              className="h-8"
                            >
                              ← Back
                            </Button>
                            <h3 className="text-sm font-medium">
                              {months[selectedMonth - 1]} {selectedYear}
                            </h3>
                            <div className="w-16" />
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                              <div key={day} className="text-xs text-muted-foreground text-center w-9">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: getFirstDayOfMonth(selectedYear, selectedMonth) }, (_, i) => (
                              <div key={`empty-${i}`} className="w-9 h-9" />
                            ))}
                            {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                              const day = i + 1;
                              const currentDate = datePickerOpen === "birth" ? form.dateOfBirth : form.dateOfDeath;
                              const isSelected = currentDate && (() => {
                                const [y, m, d] = currentDate.split("-").map(Number);
                                return y === selectedYear && m === selectedMonth && d === day;
                              })();
                              return (
                                <Button
                                  key={day}
                                  variant={isSelected ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => handleDaySelect(day)}
                                  className="h-9 w-9 p-0"
                                >
                                  {day}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dod">Date of passing</Label>
                  <Popover open={datePickerOpen === "death"} onOpenChange={(open) => {
                    if (open) {
                      handleDatePickerOpen("death");
                    } else {
                      setDatePickerOpen(null);
                      setSelectedYear(null);
                      setSelectedMonth(null);
                    }
                  }}>
                    <PopoverTrigger asChild>
                      <Button
                        id="dod"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.dateOfDeath && "text-muted-foreground"
                        )}
                        onClick={() => handleDatePickerOpen("death")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.dateOfDeath ? formatDateForDisplay(form.dateOfDeath) : <span>MM/DD/YYYY</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      {!selectedYear ? (
                        // Year selection
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium mb-3">Select Year</h3>
                          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                            {years.map((year) => (
                              <Button
                                key={year}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleYearSelect(year)}
                                className="h-8"
                              >
                                {year}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : !selectedMonth ? (
                        // Month selection
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedYear(null)}
                              className="h-8"
                            >
                              ← Back
                            </Button>
                            <h3 className="text-sm font-medium">Select Month</h3>
                            <div className="w-16" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {months.map((month, index) => (
                              <Button
                                key={month}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMonthSelect(index + 1)}
                                className="h-10"
                              >
                                {month}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Day selection
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMonth(null)}
                              className="h-8"
                            >
                              ← Back
                            </Button>
                            <h3 className="text-sm font-medium">
                              {months[selectedMonth - 1]} {selectedYear}
                            </h3>
                            <div className="w-16" />
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                              <div key={day} className="text-xs text-muted-foreground text-center w-9">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: getFirstDayOfMonth(selectedYear, selectedMonth) }, (_, i) => (
                              <div key={`empty-${i}`} className="w-9 h-9" />
                            ))}
                            {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                              const day = i + 1;
                              const currentDate = datePickerOpen === "birth" ? form.dateOfBirth : form.dateOfDeath;
                              const isSelected = currentDate && (() => {
                                const [y, m, d] = currentDate.split("-").map(Number);
                                return y === selectedYear && m === selectedMonth && d === day;
                              })();
                              return (
                                <Button
                                  key={day}
                                  variant={isSelected ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => handleDaySelect(day)}
                                  className="h-9 w-9 p-0"
                                >
                                  {day}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={heroImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => heroImageInputRef.current?.click()}
                        disabled={uploadingHero}
                      >
                        {uploadingHero ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload hero image
                          </>
                        )}
                      </Button>
                      {form.heroUrl && (
                        <Button variant="ghost" size="sm" onClick={handleRemoveHeroImage} disabled={uploadingHero}>
                          Remove
                        </Button>
                      )}
                    </div>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={portraitInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePortraitUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => portraitInputRef.current?.click()}
                        disabled={uploadingPortrait}
                      >
                        {uploadingPortrait ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload portrait
                          </>
                        )}
                      </Button>
                      {form.avatarUrl && (
                        <Button variant="ghost" size="sm" onClick={handleRemovePortrait} disabled={uploadingPortrait}>
                          Remove
                        </Button>
                      )}
                    </div>
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
                  <input
                    ref={galleryImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryImageUpload}
                  />
                  <input
                    ref={galleryVideoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleGalleryVideoUpload}
                  />
                  <Button 
                    onClick={() => galleryImageInputRef.current?.click()}
                    disabled={uploadingGallery}
                  >
                    {uploadingGallery ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload photos"
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => galleryVideoInputRef.current?.click()}
                    disabled={uploadingGallery}
                  >
                    {uploadingGallery ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload video"
                    )}
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground" disabled>
                    Manage albums
                  </Button>
                </div>
                {form.gallery.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No media uploaded yet. Click "Upload photos" or "Upload video" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {form.gallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="h-40 w-full bg-muted">
                          {item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={item.url} className="h-full w-full object-cover" controls />
                          ) : (
                            <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                          )}
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
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Gallery")}>Save gallery</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle>Family</CardTitle>
                <CardDescription>Add family members and their relationships to the memorial.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {["parent", "spouse", "child", "sibling", "grandchild"].map((relationship) => {
                    const relationshipLabel = {
                      parent: "Parents",
                      spouse: "Spouse(s)",
                      child: "Children",
                      sibling: "Siblings",
                      grandchild: "Grandchildren",
                    }[relationship as keyof typeof relationshipLabel];

                    const members = form.family.filter((f) => f.relationship === relationship);

                    return (
                      <div key={relationship} className="space-y-2">
                        <Label className="text-base font-semibold">{relationshipLabel}</Label>
                        <div className="space-y-2">
                          {members.map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                              <Input
                                value={member.name}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    family: form.family.map((f) =>
                                      f.id === member.id ? { ...f, name: e.target.value } : f
                                    ),
                                  })
                                }
                                placeholder={`Enter ${relationshipLabel.toLowerCase()} name`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    family: form.family.filter((f) => f.id !== member.id),
                                  })
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setForm({
                                ...form,
                                family: [
                                  ...form.family,
                                  {
                                    id: crypto?.randomUUID?.() ?? String(Date.now()),
                                    name: "",
                                    relationship: relationship as FamilyMember["relationship"],
                                  },
                                ],
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add {relationshipLabel.slice(0, -1)}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSave("Family")}>Save family</Button>
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
                                onClick={async () => {
                                  // Update in database
                                  const { error } = await supabase
                                    .from("guestbook_entries")
                                    .update({ status: "approved" })
                                    .eq("id", submission.id)
                                    .eq("memorial_id", form.id);

                                  if (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to approve entry.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  // Update local state
                                  setForm({
                                    ...form,
                                    submissions: form.submissions.map((item) =>
                                      item.id === submission.id ? { ...item, status: "approved" } : item,
                                    ),
                                  });

                                  toast({
                                    title: "Approved",
                                    description: "Entry is now visible on the public memorial.",
                                  });
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  // Update in database
                                  const { error } = await supabase
                                    .from("guestbook_entries")
                                    .update({ status: "rejected" })
                                    .eq("id", submission.id)
                                    .eq("memorial_id", form.id);

                                  if (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to reject entry.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  // Update local state
                                  setForm({
                                    ...form,
                                    submissions: form.submissions.map((item) =>
                                      item.id === submission.id ? { ...item, status: "rejected" } : item,
                                    ),
                                  });

                                  toast({
                                    title: "Rejected",
                                    description: "Entry has been rejected and will not be displayed.",
                                  });
                                }}
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


