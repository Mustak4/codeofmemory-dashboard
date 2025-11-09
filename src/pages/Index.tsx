import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, QrCode, Clock, Shield, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { getLocalBusinessSchema } from "@/utils/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBackground from "@/assets/hero-background.jpg";
import { useEffect } from "react";

const Index = () => {
  const { t } = useLanguage();
  
  // Preload hero image for better LCP
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroBackground;
    document.head.appendChild(link);
  }, []);

  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <div className="min-h-screen">
      <SEO
        page="home"
        canonical="/"
        structuredData={localBusinessSchema}
      />
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
          role="img"
          aria-label="Peaceful memorial setting with warm natural lighting"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-slow">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-8 text-permanence leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" asChild className="px-10 py-6">
              <Link to="/create">{t("home.createMemorialButton")}</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-10 py-6">
              {t("home.viewExampleButton")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-6 text-permanence">
            {t("home.howItWorksTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            {t("home.howItWorksSubtitle")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <QrCode className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("home.step1Title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.step1Description")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Heart className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("home.step2Title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.step2Description")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Shield className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("home.step3Title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.step3Description")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "300ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Clock className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("home.step4Title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.step4Description")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-memory text-center">{t("about.whyWeStartedTitle")}</h2>
              <div className="space-y-4 text-lg text-foreground leading-relaxed">
                <p>{t("about.whyWeStartedText1")}</p>
                <p>{t("about.whyWeStartedText2")}</p>
                <p>{t("about.whyWeStartedText3")}</p>
                <p className="text-memory font-medium">{t("about.whyWeStartedText4")}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-6 text-permanence">
            {t("about.valuesTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Heart className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("about.valueRespectTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.valueRespectDescription")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Users className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("about.valueConnectionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.valueConnectionDescription")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Shield className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("about.valuePrivacyTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.valuePrivacyDescription")}
              </p>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in bg-card/50 backdrop-blur-sm" style={{ animationDelay: "300ms" }}>
              <div className="w-14 h-14 rounded-full bg-earth/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Sparkles className="w-7 h-7 text-earth" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-memory">{t("about.valuePermanenceTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.valuePermanenceDescription")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-memory text-center">{t("about.howWeHelpTitle")}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-memory">{t("about.beforeLossTitle")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.beforeLossDescription")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-memory">{t("about.afterLossTitle")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.afterLossDescription")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-memory">{t("about.overTimeTitle")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.overTimeDescription")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-permanence">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {t("home.ctaSubtitle")}
            </p>
            <Button variant="hero" size="lg" asChild className="px-12 py-6">
              <Link to="/order">{t("home.ctaButton")}</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-6">
              {t("common.learnMore")} {t("common.visit")} <Link to="/faq" className="text-earth hover:text-memory underline">{t("common.faq")}</Link> {t("common.forAnswers")} {t("common.or")} <Link to="/contact" className="text-earth hover:text-memory underline">{t("common.getInTouch")}</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
