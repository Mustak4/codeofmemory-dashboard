import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Example memorial data
const memorialData = {
  name: "Eleanor Rose Thompson",
  birthDate: "March 15, 1945",
  deathDate: "November 2, 2024",
  biography: `Eleanor was a devoted mother, grandmother, and friend whose warmth touched everyone she met. 
  She spent her life teaching elementary school, where generations of children learned not just reading and math, 
  but also kindness and compassion. Her garden was her sanctuary, and she loved sharing its beauty with neighbors 
  and friends. Eleanor's laughter was infectious, her wisdom gentle, and her love unconditional.`,
  memories: [
    {
      id: 1,
      author: "Sarah Thompson",
      date: "November 5, 2024",
      text: "Mom taught me that the smallest acts of kindness matter most. I'll never forget the way she'd leave notes in our lunchboxes every single day.",
    },
    {
      id: 2,
      author: "Michael Chen",
      date: "November 6, 2024",
      text: "Mrs. Thompson was my third grade teacher. She believed in me when no one else did. Her encouragement changed my life.",
    },
    {
      id: 3,
      author: "Grace Williams",
      date: "November 8, 2024",
      text: "Eleanor's garden was a masterpiece. She'd invite the neighborhood kids to help plant flowers every spring. Those are memories I'll treasure forever.",
    },
  ],
};

const Memorial = () => {
  const [newMemory, setNewMemory] = useState("");
  const { toast } = useToast();

  const handleSubmitMemory = () => {
    if (newMemory.trim()) {
      toast({
        title: "Memory shared",
        description: "Your memory has been added to Eleanor's tribute.",
      });
      setNewMemory("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Memorial Header */}
        <div className="text-center mb-16 animate-fade-in-slow">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-comfort to-earth mx-auto mb-8 flex items-center justify-center shadow-xl">
            <span className="text-6xl text-warmth font-serif">ER</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-permanence leading-tight">
            {memorialData.name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-lg">
            <span>{memorialData.birthDate}</span>
            <span>—</span>
            <span>{memorialData.deathDate}</span>
          </div>
        </div>

        {/* Biography */}
        <Card className="p-10 mb-12 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
          <h2 className="text-2xl font-serif mb-6 text-memory flex items-center gap-2">
            <Heart className="w-6 h-6 text-earth" />
            In Loving Memory
          </h2>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
            {memorialData.biography}
          </p>
        </Card>

        {/* Memories Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-3xl font-serif mb-8 text-memory flex items-center gap-2">
            <Calendar className="w-7 h-7 text-earth" />
            Shared Memories
          </h2>

          <div className="space-y-6 mb-8">
            {memorialData.memories.map((memory, index) => (
              <Card
                key={memory.id}
                className="p-6 border-border/50 hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium text-memory">{memory.author}</p>
                  <p className="text-sm text-muted-foreground">{memory.date}</p>
                </div>
                <p className="text-foreground leading-relaxed">{memory.text}</p>
              </Card>
            ))}
          </div>

          {/* Add Memory Form */}
          <Card className="p-8 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h3 className="text-xl font-serif mb-4 text-memory">Leave a Memory</h3>
            <p className="text-muted-foreground mb-6">
              Share your story. Every memory helps keep their spirit alive.
            </p>
            <Textarea
              placeholder="Write your memory here..."
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              className="mb-4 min-h-32 resize-none bg-background/50"
            />
            <Button
              variant="tribute"
              onClick={handleSubmitMemory}
              className="w-full md:w-auto"
            >
              Share This Memory
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Memorial;
