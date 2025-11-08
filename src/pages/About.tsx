import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Heart, Users, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getLocalBusinessSchema } from "@/utils/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO
        page="about"
        canonical="/about"
        structuredData={localBusinessSchema}
      />
      <Header />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            {t("about.title")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-6 text-memory">{t("about.whyWeStartedTitle")}</h2>
            <div className="space-y-4 text-lg text-foreground leading-relaxed">
              <p>{t("about.whyWeStartedText1")}</p>
              <p>{t("about.whyWeStartedText2")}</p>
              <p>{t("about.whyWeStartedText3")}</p>
              <p className="text-memory font-medium">{t("about.whyWeStartedText4")}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/50">
              <Link to="/contact" className="text-earth hover:text-memory underline font-medium">
                {t("common.getInTouch")} →
              </Link>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-serif text-center mb-12 text-permanence">{t("about.valuesTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

        {/* How We Help Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-10 border-border/50 shadow-lg bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-6 text-memory">{t("about.howWeHelpTitle")}</h2>
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
      </main>

      <Footer />
    </div>
  );
};

export default About;
