import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Heart, Users, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            To preserve the stories that matter most through technology that feels human.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-6 text-memory">Why We Started</h2>
            <div className="space-y-4 text-lg text-foreground leading-relaxed">
              <p>
                CodeOfMemory was born from a simple moment: standing at a memorial, reading a name and two dates, 
                and wishing we could know more about the person behind those numbers.
              </p>
              <p>
                We realized that while physical memorials preserve where someone rests, they rarely capture 
                who they were. The laughter they shared, the wisdom they offered, the small moments that made them unforgettable.
              </p>
              <p>
                Technology gave us the answer. A simple QR code could bridge the physical and digital, 
                connecting a memorial plaque to a living, breathing collection of memories. Stories that can be 
                added to over time. Photos that bring smiles. Words that keep their spirit alive.
              </p>
              <p className="text-memory font-medium">
                Every life tells a story. We're here to make sure those stories are never forgotten.
              </p>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-serif text-center mb-12 text-permanence">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Respect</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every memorial is treated with dignity and care. This isn't just technology—it's sacred.
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                We help families stay connected across time and distance through shared memories.
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Privacy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your memories are protected. You control who sees what, always.
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "300ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-earth" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">Permanence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built to last forever. These memories aren't temporary—they're your legacy.
              </p>
            </Card>
          </div>
        </div>

        {/* How We Help Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-6 text-memory">How We Help Families</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-memory">Before Loss</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Help loved ones create their own tribute while they can share their story in their own words.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-memory">After Loss</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Give families a gentle, guided way to celebrate a life and keep memories accessible forever.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-memory">Over Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Memorial pages grow as family and friends add new memories, keeping the connection alive for generations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
