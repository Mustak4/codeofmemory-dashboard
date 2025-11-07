import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Manchester, UK",
    date: "January 2025",
    rating: 5,
    text: "CodeOfMemory helped us create something truly special for my father. The QR code on his plaque connects to a beautiful page filled with stories from family and friends. It's comforting to know his memory will live on digitally.",
    memorial: "In memory of Robert Mitchell",
  },
  {
    id: 2,
    name: "James Chen",
    location: "London, UK",
    date: "December 2024",
    rating: 5,
    text: "The process was so gentle and thoughtful. During a difficult time, having this guided way to celebrate my mother's life meant everything. The team was incredibly supportive.",
    memorial: "In memory of Linda Chen",
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "Edinburgh, UK",
    date: "November 2024",
    rating: 5,
    text: "I ordered a plaque for my grandmother's memorial. The quality is exceptional, and the QR code works perfectly. Family members who couldn't attend the service can now see photos and read stories about her remarkable life.",
    memorial: "In memory of Margaret Williams",
  },
  {
    id: 4,
    name: "David Thompson",
    location: "Bristol, UK",
    date: "October 2024",
    rating: 5,
    text: "We used CodeOfMemory to pre-plan my wife's memorial while she was still with us. She loved being able to choose her photos and write her own story. It was a beautiful, healing experience for our family.",
    memorial: "In memory of Helen Thompson",
  },
  {
    id: 5,
    name: "Rachel Foster",
    location: "Birmingham, UK",
    date: "September 2024",
    rating: 5,
    text: "The memorial page is beautifully designed and so easy to use. We've been able to add new memories over time, and it's become a place where the family gathers digitally to remember and share stories.",
    memorial: "In memory of Peter Foster",
  },
  {
    id: 6,
    name: "Michael O'Connor",
    location: "Dublin, Ireland",
    date: "August 2024",
    rating: 5,
    text: "As a funeral director, I've recommended CodeOfMemory to many families. The response has been overwhelmingly positive. It's a dignified, modern way to preserve memories.",
    memorial: "Professional recommendation",
  },
];

const Reviews = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Stories from Families
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Hear from those who've trusted us with their most precious memories.
          </p>
        </div>

        {/* Overall Rating */}
        <Card className="max-w-2xl mx-auto p-8 mb-12 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 fill-earth text-earth" />
              ))}
            </div>
            <p className="text-3xl font-serif text-memory mb-2">5.0 out of 5</p>
            <p className="text-muted-foreground">Based on 127 reviews</p>
          </div>
        </Card>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <Card
              key={review.id}
              className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Quote className="w-8 h-8 text-earth/30 mb-4" />
              
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? "fill-earth text-earth" : "text-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6">{review.text}</p>

              <div className="border-t border-border/50 pt-4">
                <p className="font-medium text-memory">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
                <p className="text-sm text-muted-foreground mt-2 italic">{review.memorial}</p>
                <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">Ready to Create Your Memorial?</h2>
            <p className="text-muted-foreground mb-6">
              Join the families who trust us to preserve their most precious memories.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/create"
                className="inline-flex items-center justify-center px-8 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Tribute
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
