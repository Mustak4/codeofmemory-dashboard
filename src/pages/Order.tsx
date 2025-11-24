import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ZoomIn } from "lucide-react";
import LazyImage from "@/components/LazyImage";

const plaqueOptions = [
  { 
    id: "plexiglass", 
    name: "Black Engraved Plexiglass", 
    price: 79, 
    tagline: "Modern, minimal, engraved finish",
    description: "A sleek black acrylic plaque engraved with a permanent QR code. Durable, elegant, and ideal for both indoor and outdoor use.",
    image: "/product-images/plexiglass.png"
  },
  { 
    id: "acrylic", 
    name: "Two-Tone Gold or Silver Acrylic", 
    price: 99, 
    tagline: "Elegant metallic dual-layer design",
    description: "A premium dual-layer acrylic plaque available in gold or silver. The engraved black inner layer creates a timeless, high-contrast finish.",
    imageGold: "/product-images/acrylic gold.png",
    imageSilver: "/product-images/acrylic silver.png"
  },
  { 
    id: "slate", 
    name: "Natural Stone Plaque (Slate)", 
    price: 119, 
    tagline: "Authentic, weather-resistant finish",
    description: "A natural hand-cut stone plaque engraved with precision. Perfect for outdoor memorials, offering durability and a classic, timeless appearance.",
    image: "/product-images/slate.png"
  },
];

const Order = () => {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [selectedPlaque, setSelectedPlaque] = useState("plexiglass");
  const [selectedColor, setSelectedColor] = useState<"gold" | "silver">("gold");
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const { toast } = useToast();

  const handleContinue = () => {
    setShowPaymentInfo(true);
    // Scroll to payment info section
    setTimeout(() => {
      const element = document.getElementById("payment-info");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleProceedToPayment = () => {
    // TODO: Redirect to Stripe checkout
    // window.location.href = stripeCheckoutUrl;
    toast({
      title: "Redirecting to payment",
      description: "You will be redirected to complete your payment.",
    });
  };

  const selectedPrice = plaqueOptions.find((p) => p.id === selectedPlaque)?.price || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-slow">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-permanence leading-tight">
            Order Your Memorial
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create a lasting tribute with a beautiful memorial plaque.
          </p>
        </div>


        {/* Form Card */}
        <Card className="max-w-7xl mx-auto p-8 md:p-12 border-border/50 shadow-xl animate-fade-in bg-card/80 backdrop-blur-sm">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-8 text-memory">Choose Your Plaque</h2>
              <RadioGroup 
                value={selectedPlaque} 
                onValueChange={(value) => {
                  setSelectedPlaque(value);
                  if (value !== "acrylic") {
                    setSelectedColor("gold");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plaqueOptions.map((option) => {
                    const getImageSrc = (): string => {
                      if (option.id === "acrylic") {
                        return selectedColor === "gold" 
                          ? (option.imageGold || "/product-images/acrylic gold.png")
                          : (option.imageSilver || "/product-images/acrylic silver.png");
                      }
                      return option.image || "";
                    };

                    const imageSrc = getImageSrc();
                    const isSelected = selectedPlaque === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`group relative flex flex-col h-full border rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-card shadow-sm hover:shadow-lg ${
                          isSelected
                            ? "border-earth border-2 shadow-xl ring-2 ring-earth/20"
                            : "border-border/60 hover:border-earth/40"
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.id} 
                          className="absolute top-4 left-4 z-20 w-5 h-5 border-2 bg-background" 
                        />
                        
                        {/* Product Image */}
                        <div 
                          className="relative w-full h-64 bg-gradient-to-b from-muted/40 via-muted/20 to-muted/10 overflow-hidden group/image"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setZoomedImage({ src: imageSrc, alt: option.name });
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center p-6 cursor-zoom-in">
                            <LazyImage
                              src={imageSrc}
                              alt={option.name}
                              className={`w-full h-full object-contain transition-transform duration-300 ${
                                isSelected ? "scale-105" : "group-hover:scale-[1.03]"
                              }`}
                              priority={isSelected}
                            />
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-earth/5 pointer-events-none" />
                          )}
                          {/* Zoom Icon Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/image:bg-black/10 transition-all duration-300 pointer-events-none">
                            <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-full p-3">
                              <ZoomIn className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex flex-col flex-1 p-5 space-y-3">
                          <div className="flex-1 space-y-2">
                            <p className="font-serif text-lg text-memory font-semibold leading-tight">
                              {option.name}
                            </p>
                            <p className="text-xs font-medium text-earth uppercase tracking-wider">
                              {option.tagline}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {option.description}
                            </p>
                          </div>
                          
                          <div className="pt-3 space-y-3 border-t border-border/50">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-serif font-bold text-memory">
                                ${option.price}
                              </span>
                            </div>
                            
                            {option.id === "acrylic" && isSelected && (
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Color:</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedColor("gold");
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                                      selectedColor === "gold"
                                        ? "bg-earth text-warmth shadow-md"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                  >
                                    Gold
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedColor("silver");
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                                      selectedColor === "silver"
                                        ? "bg-earth text-warmth shadow-md"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                  >
                                    Silver
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-end mt-10 pt-8 border-t border-border/50">
              <Button variant="hero" onClick={handleContinue} className="gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Information Section */}
        {showPaymentInfo && (
          <Card 
            id="payment-info"
            className="max-w-4xl mx-auto mt-12 p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-center mb-6 text-memory">Next Steps</h2>
              
              <div className="space-y-4 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    After you complete your payment, we will verify your order and send you a link to start creating your digital memorial. You'll receive a simple tutorial to guide you through the process.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    We'll notify you via email once your payment has been verified and your account has been approved. Verification typically takes up to 2 hours.
                  </p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Plaque</span>
                    <span className="text-memory">${selectedPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Memorial Page Setup</span>
                    <span className="text-memory">Included</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-memory">$8.99</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="font-serif text-lg text-memory">Total</span>
                    <span className="font-serif text-2xl text-memory">${(selectedPrice + 8.99).toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Shipping typically takes 7 to 14 business days
                </p>

                <Button 
                  variant="hero" 
                  onClick={handleProceedToPayment} 
                  className="gap-2 mt-6 px-10 py-6 text-lg"
                  size="lg"
                >
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />

      {/* Image Zoom Dialog */}
      <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
          {zoomedImage && (
            <div className="relative w-full max-h-[90vh] flex items-center justify-center">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;
