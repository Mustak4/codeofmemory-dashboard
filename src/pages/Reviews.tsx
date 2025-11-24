import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Reviews = () => {
  const { t } = useLanguage();
  
  // Get reviews from translations based on current language
  const reviews = (t("reviews.reviewList", { returnObjects: true }) as Array<{
    id: number;
    name: string;
    location: string;
    date: string;
    text: string;
    memorial: string;
  }>) || [];
  
  // Add rating to each review (all are 5 stars)
  const reviewsWithRating = reviews.map(review => ({
    ...review,
    rating: 5
  }));
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "QR Code Memorial Plaque",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewsWithRating.length > 0 ? "5.0" : "0",
      reviewCount: reviewsWithRating.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };

  const reviewCountText = reviewsWithRating.length === 1 ? t("reviews.review") : t("reviews.reviews");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO
        page="reviews"
        canonical="/reviews"
        structuredData={aggregateRatingSchema}
      />
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            {t("reviews.pageTitle")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("reviews.pageSubtitle")}
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
            <p className="text-3xl font-serif text-memory mb-2">
              {reviewsWithRating.length > 0 ? "5.0" : "0"} {t("reviews.outOf5")}
            </p>
            <p className="text-muted-foreground">
              {t("reviews.basedOn")} {reviewsWithRating.length} {reviewCountText}
            </p>
          </div>
        </Card>

        {/* Reviews Grid */}
        {reviewsWithRating.length === 0 ? (
          <Card className="max-w-2xl mx-auto p-8 mb-12 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <p className="text-muted-foreground text-center">{t("reviews.noReviews")}</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
            {reviewsWithRating.map((review, index) => (
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
                <p className="text-sm text-muted-foreground mt-2 italic">
                  {t("reviews.inMemoryOf")} {review.memorial}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
              </div>
            </Card>
          ))}
          </div>
        )}

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">{t("reviews.readyToCreate")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("reviews.joinFamilies")}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t("reviews.startTribute")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-all duration-300"
              >
                {t("reviews.contactUs")}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              <Link to="/faq#how-it-works" className="text-earth hover:text-memory underline">
                {t("reviews.readHowItWorks")} →
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
