import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, QrCode, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-slow">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-8 text-permanence leading-tight">
            Scan. Remember. Forever.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Every story deserves to be remembered. Create a lasting digital tribute for your loved ones.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" asChild className="px-10 py-6">
              <Link to="/create">Create a Memorial</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-10 py-6">
              View Example
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-6 text-permanence">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Three simple steps to create a meaningful, lasting tribute
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <QrCode className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Create Your Page</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build a beautiful memorial page with photos, stories, and memories
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Add Memories</h3>
              <p className="text-muted-foreground leading-relaxed">
                Invite family to share their stories and keep memories alive together
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Order Your Plaque</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from beautiful memorial plaques with embedded QR codes
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "300ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Forever Accessible</h3>
              <p className="text-muted-foreground leading-relaxed">
                A simple scan connects anyone to the full story, anytime, anywhere
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-permanence">
              Every Life Tells a Story
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Honor their memory with a tribute that lasts forever. No rush. Take your time.
            </p>
            <Button variant="hero" size="lg" asChild className="px-12 py-6">
              <Link to="/create">Begin Your Tribute</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
