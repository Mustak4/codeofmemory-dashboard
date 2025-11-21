import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

// Reviews will be fetched from database or CMS
const reviews: Array<{
  id: number;
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  memorial: string;
}> = [];

const Reviews = () => {
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "QR Code Memorial Plaque",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.length > 0 ? "5.0" : "0",
      reviewCount: reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO
        title="Customer Reviews – CodeOfMemory"
        description={`Read stories from families who've trusted CodeOfMemory with their most precious memories. ${reviews.length > 0 ? "5.0" : "0"} out of 5 stars from ${reviews.length} review${reviews.length !== 1 ? "s" : ""}.`}
        ogTitle="Customer Reviews – CodeOfMemory"
        ogDescription={`${reviews.length > 0 ? "5.0" : "0"} out of 5 stars from ${reviews.length} review${reviews.length !== 1 ? "s" : ""}. Read stories from families who've created lasting QR code memorial plaques.`}
        canonical="/reviews"
        structuredData={aggregateRatingSchema}
      />
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
            <p className="text-3xl font-serif text-memory mb-2">{reviews.length > 0 ? "5.0" : "0"} out of 5</p>
            <p className="text-muted-foreground">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </Card>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <Card className="max-w-2xl mx-auto p-8 mb-12 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <p className="text-muted-foreground text-center">No reviews available yet.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
            {reviews.map((review, index) => (
            <Card
              key={review.id}
              className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Quote className="w-8 h-8 text-earth/30 mb-4" aria-hidden="true" />
              
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
        )}

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">Ready to Create Your Memorial?</h2>
            <p className="text-muted-foreground mb-6">
              Join the families who trust us to preserve their most precious memories.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Tribute
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              <Link to="/faq#how-it-works" className="text-earth hover:text-memory underline">
                Read how it works →
              </Link>
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
