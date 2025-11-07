import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      setErrors({});
      
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We'll respond within 24 hours.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're here to help. No question is too small.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
              <h2 className="text-2xl font-serif mb-6 text-memory">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base mb-2 block">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Smith"
                    className="bg-background/50"
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-base mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="bg-background/50"
                    maxLength={255}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="text-base mb-2 block">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="How can we help you today?"
                    className="min-h-40 resize-none bg-background/50"
                    maxLength={1000}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-8 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <h3 className="text-xl font-serif mb-6 text-memory">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-earth mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:hello@codeofmemory.com" className="text-memory hover:text-earth transition-colors">
                      hello@codeofmemory.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-earth mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href="tel:+441234567890" className="text-memory hover:text-earth transition-colors">
                      +44 123 456 7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-earth mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-memory">
                      KKOSTOV LTD<br />
                      London, United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <h3 className="text-xl font-serif mb-6 text-memory">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-earth/20 flex items-center justify-center text-earth hover:bg-earth hover:text-warmth transition-all duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-earth/20 flex items-center justify-center text-earth hover:bg-earth hover:text-warmth transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-earth/20 flex items-center justify-center text-earth hover:bg-earth hover:text-warmth transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </Card>

            <Card className="p-8 border-border/50 bg-muted/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We typically respond within 24 hours during business days. For urgent matters, please call us directly.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
