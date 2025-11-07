import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create a memorial page?",
        a: "Simply click 'Create Memorial' and follow our gentle, step-by-step guide. You'll add basic information, upload photos, and write or paste a biography. The entire process takes about 15-20 minutes, but you can save and return anytime.",
      },
      {
        q: "Can I create a memorial before someone passes?",
        a: "Absolutely. Many families find it healing to create a 'living memorial' where the person can share their own story, choose their photos, and record their memories while they're still with us.",
      },
      {
        q: "Do I need to be tech-savvy?",
        a: "Not at all. We've designed CodeOfMemory to be simple and intuitive. If you can send an email, you can create a beautiful memorial.",
      },
    ],
  },
  {
    category: "QR Codes & Plaques",
    questions: [
      {
        q: "How do QR codes work?",
        a: "Each memorial plaque includes a unique QR code. When someone scans it with their smartphone camera, they're instantly directed to the memorial page. No app needed—it works with any modern smartphone.",
      },
      {
        q: "What plaque materials are available?",
        a: "We offer brushed stainless steel, bronze, brass, and black granite plaques. Each is weather-resistant and built to last decades. The QR codes are laser-engraved for permanence.",
      },
      {
        q: "How long does delivery take?",
        a: "UK orders typically arrive within 7-10 business days. International orders take 14-21 days. Each plaque is handcrafted with care—we never rush quality.",
      },
      {
        q: "Can I update the memorial page after receiving the plaque?",
        a: "Yes! The QR code always points to your memorial page. You can add photos, stories, and memories anytime—the code never changes.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Who can see the memorial page?",
        a: "You control visibility. Pages can be fully public, password-protected, or private (invitation-only). You can change these settings anytime.",
      },
      {
        q: "What happens to my data?",
        a: "Your memorial data is stored securely and encrypted. We never sell or share your information. Memorial pages are preserved permanently—they won't disappear if you stop paying.",
      },
      {
        q: "Can I delete a memorial?",
        a: "Yes, you have full control. You can delete or archive a memorial at any time from your account settings.",
      },
    ],
  },
  {
    category: "Pricing & Orders",
    questions: [
      {
        q: "How much does a memorial plaque cost?",
        a: "Plaques start at £79 for stainless steel and £129 for bronze. This includes the memorial page setup, QR code, and lifetime hosting. No subscription fees.",
      },
      {
        q: "Is there a monthly fee?",
        a: "No. Once you order a plaque, your memorial page is hosted forever at no additional cost. Optional premium features (like custom domains) are available but never required.",
      },
      {
        q: "Can I order just a digital memorial without a plaque?",
        a: "Yes. Digital-only memorials are free to create. You'll get a shareable link instead of a QR code plaque.",
      },
    ],
  },
  {
    category: "Adding Memories",
    questions: [
      {
        q: "Can family and friends add to the memorial?",
        a: "Yes! You can invite others to contribute photos and memories. You approve each addition before it appears on the page.",
      },
      {
        q: "Is there a limit to how many photos I can add?",
        a: "No photo limits. Add as many as you'd like—your memorial grows over time.",
      },
      {
        q: "Can I include videos?",
        a: "Yes. You can embed videos from YouTube, Vimeo, or upload directly (premium feature).",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about creating lasting memorials.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((section, index) => (
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
            <h2 className="text-3xl font-serif mb-4 text-memory">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              We're here to help. Reach out anytime—no question is too small.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-memory text-warmth hover:bg-memory/90 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </a>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
