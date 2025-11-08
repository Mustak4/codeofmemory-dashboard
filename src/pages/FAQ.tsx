import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.questionCreatePage"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerCreatePage") },
      },
      {
        "@type": "Question",
        name: t("faq.questionBeforePasses"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerBeforePasses") },
      },
      {
        "@type": "Question",
        name: t("faq.questionTechSavvy"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerTechSavvy") },
      },
      {
        "@type": "Question",
        name: t("faq.questionQRWork"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerQRWork") },
      },
      {
        "@type": "Question",
        name: t("faq.questionMaterials"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerMaterials") },
      },
      {
        "@type": "Question",
        name: t("faq.questionDelivery"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerDelivery") },
      },
      {
        "@type": "Question",
        name: t("faq.questionUpdatePage"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerUpdatePage") },
      },
      {
        "@type": "Question",
        name: t("faq.questionWhoCanSee"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerWhoCanSee") },
      },
      {
        "@type": "Question",
        name: t("faq.questionData"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerData") },
      },
      {
        "@type": "Question",
        name: t("faq.questionDelete"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerDelete") },
      },
      {
        "@type": "Question",
        name: t("faq.questionCost"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerCost") },
      },
      {
        "@type": "Question",
        name: t("faq.questionMonthlyFee"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerMonthlyFee") },
      },
      {
        "@type": "Question",
        name: t("faq.questionDigitalOnly"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerDigitalOnly") },
      },
      {
        "@type": "Question",
        name: t("faq.questionFamilyAdd"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerFamilyAdd") },
      },
      {
        "@type": "Question",
        name: t("faq.questionPhotoLimit"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerPhotoLimit") },
      },
      {
        "@type": "Question",
        name: t("faq.questionVideos"),
        acceptedAnswer: { "@type": "Answer", text: t("faq.answerVideos") },
      },
    ],
  };

  const faqSections = [
    {
      category: t("faq.categoryGettingStarted"),
      questions: [
        { q: t("faq.questionCreatePage"), a: t("faq.answerCreatePage") },
        { q: t("faq.questionBeforePasses"), a: t("faq.answerBeforePasses") },
        { q: t("faq.questionTechSavvy"), a: t("faq.answerTechSavvy") },
      ],
    },
    {
      category: t("faq.categoryQRCodes"),
      questions: [
        { q: t("faq.questionQRWork"), a: t("faq.answerQRWork") },
        { q: t("faq.questionMaterials"), a: t("faq.answerMaterials") },
        { q: t("faq.questionDelivery"), a: t("faq.answerDelivery") },
        { q: t("faq.questionUpdatePage"), a: t("faq.answerUpdatePage") },
      ],
    },
    {
      category: t("faq.categoryPrivacy"),
      questions: [
        { q: t("faq.questionWhoCanSee"), a: t("faq.answerWhoCanSee") },
        { q: t("faq.questionData"), a: t("faq.answerData") },
        { q: t("faq.questionDelete"), a: t("faq.answerDelete") },
      ],
    },
    {
      category: t("faq.categoryPricing"),
      questions: [
        { q: t("faq.questionCost"), a: t("faq.answerCost") },
        { q: t("faq.questionMonthlyFee"), a: t("faq.answerMonthlyFee") },
        { q: t("faq.questionDigitalOnly"), a: t("faq.answerDigitalOnly") },
      ],
    },
    {
      category: t("faq.categoryMemories"),
      questions: [
        { q: t("faq.questionFamilyAdd"), a: t("faq.answerFamilyAdd") },
        { q: t("faq.questionPhotoLimit"), a: t("faq.answerPhotoLimit") },
        { q: t("faq.questionVideos"), a: t("faq.answerVideos") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <SEO
        page="faq"
        canonical="/faq"
        structuredData={faqPageSchema}
      />
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqSections.map((section, index) => (
            <Card
              key={section.category}
              className="p-8 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h2 className="text-2xl font-serif mb-6 text-memory">{section.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((faq, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-foreground hover:text-memory">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="p-10 border-border/50 shadow-lg text-center bg-card/70 backdrop-blur-sm">
            <h2 className="text-3xl font-serif mb-4 text-memory">{t("faq.stillHaveQuestions")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("faq.stillHaveQuestionsText")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("common.contactUs")}
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
