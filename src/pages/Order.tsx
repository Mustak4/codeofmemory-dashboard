import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

const plaqueOptions = [
  { id: "steel", name: "Brushed Stainless Steel", price: 79, description: "Modern, weather-resistant finish" },
  { id: "bronze", name: "Bronze", price: 129, description: "Classic, timeless elegance" },
  { id: "brass", name: "Brass", price: 119, description: "Warm, traditional look" },
  { id: "granite", name: "Black Granite", price: 149, description: "Premium stone with engraving" },
];

const Order = () => {
  const [step, setStep] = useState(1);
  const [selectedPlaque, setSelectedPlaque] = useState("steel");
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast({
      title: "Order placed",
      description: "Thank you! We'll send you a confirmation email shortly.",
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

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                    step >= num
                      ? "bg-earth text-warmth"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      step > num ? "bg-earth" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm text-muted-foreground">
            <span className={step >= 1 ? "text-memory" : ""}>Plaque</span>
            <span className={step >= 2 ? "text-memory" : ""}>Details</span>
            <span className={step >= 3 ? "text-memory" : ""}>Memorial</span>
            <span className={step >= 4 ? "text-memory" : ""}>Checkout</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl mx-auto p-10 border-border/50 shadow-lg animate-fade-in bg-card/70 backdrop-blur-sm">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-center mb-6 text-memory">Choose Your Plaque</h2>
              <RadioGroup value={selectedPlaque} onValueChange={setSelectedPlaque}>
                <div className="grid md:grid-cols-2 gap-4">
                  {plaqueOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`relative flex items-start p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedPlaque === option.id
                          ? "border-earth bg-earth/5"
                          : "border-border hover:border-earth/50"
                      }`}
                    >
                      <RadioGroupItem value={option.id} className="mt-1" />
                      <div className="ml-4 flex-1">
                        <p className="font-serif text-lg text-memory mb-1">{option.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                        <p className="text-2xl font-medium text-memory">£{option.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-center mb-6 text-memory">Inscription Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plaque-name" className="text-base mb-2 block">
                    Name for Plaque
                  </Label>
                  <Input
                    id="plaque-name"
                    placeholder="Eleanor Rose Thompson"
                    className="bg-background/50"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plaque-birth" className="text-base mb-2 block">
                      Birth Year
                    </Label>
                    <Input
                      id="plaque-birth"
                      placeholder="1945"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plaque-death" className="text-base mb-2 block">
                      Year of Passing
                    </Label>
                    <Input
                      id="plaque-death"
                      placeholder="2024"
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="plaque-message" className="text-base mb-2 block">
                    Optional Message (Max 50 characters)
                  </Label>
                  <Input
                    id="plaque-message"
                    placeholder="Forever in our hearts"
                    className="bg-background/50"
                    maxLength={50}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep it short—space is limited on the plaque
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-center mb-6 text-memory">Memorial Page Link</h2>
              <p className="text-center text-muted-foreground mb-6">
                Your plaque will include a QR code linking to your memorial page. You can create or link an existing memorial.
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-2 block">Memorial Page Option</Label>
                  <RadioGroup defaultValue="create">
                    <div className="space-y-3">
                      <label className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer hover:border-earth/50 transition-all">
                        <RadioGroupItem value="create" className="mt-1" />
                        <div className="ml-4">
                          <p className="font-medium text-memory">Create New Memorial</p>
                          <p className="text-sm text-muted-foreground">Set up a fresh memorial page</p>
                        </div>
                      </label>
                      <label className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer hover:border-earth/50 transition-all">
                        <RadioGroupItem value="existing" className="mt-1" />
                        <div className="ml-4">
                          <p className="font-medium text-memory">Link Existing Memorial</p>
                          <p className="text-sm text-muted-foreground">Connect to a memorial you've already created</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-center mb-6 text-memory">Shipping & Payment</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full-name" className="text-base mb-2 block">
                    Full Name
                  </Label>
                  <Input id="full-name" className="bg-background/50" />
                </div>

                <div>
                  <Label htmlFor="address" className="text-base mb-2 block">
                    Shipping Address
                  </Label>
                  <Textarea id="address" className="bg-background/50 resize-none" rows={3} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-base mb-2 block">
                      Email
                    </Label>
                    <Input id="email" type="email" className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base mb-2 block">
                      Phone
                    </Label>
                    <Input id="phone" type="tel" className="bg-background/50" />
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Plaque</span>
                    <span className="text-memory">£{selectedPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Memorial Page Setup</span>
                    <span className="text-memory">Included</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping (UK)</span>
                    <span className="text-memory">£8.99</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="font-serif text-lg text-memory">Total</span>
                    <span className="font-serif text-2xl text-memory">£{selectedPrice + 8.99}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-8 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 4 ? (
              <Button variant="hero" onClick={handleNext} className="gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit} className="gap-2 px-8">
                Complete Order
              </Button>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
