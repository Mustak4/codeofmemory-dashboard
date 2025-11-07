import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CreateTribute = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast({
      title: "Tribute created",
      description: "Your memorial page has been created successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg font-serif text-memory hover:text-earth transition-colors">
            CodeOfMemory
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-3 mb-12 animate-fade-in">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= num ? "bg-earth" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <Card className="p-10 border-border/50 shadow-lg animate-fade-in-slow bg-card/70 backdrop-blur-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif mb-3 text-permanence">Basic Information</h1>
                <p className="text-muted-foreground">Let's start with the essentials. Take your time.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="full-name" className="text-base mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="full-name"
                    placeholder="Eleanor Rose Thompson"
                    className="bg-background/50"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birth-date" className="text-base mb-2 block">
                      Birth Date
                    </Label>
                    <Input
                      id="birth-date"
                      type="date"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="death-date" className="text-base mb-2 block">
                      Date of Passing
                    </Label>
                    <Input
                      id="death-date"
                      type="date"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif mb-3 text-permanence">Their Story</h1>
                <p className="text-muted-foreground">Share what made them special. We can help you find the words.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="biography" className="text-base mb-2 block">
                    Life Story
                  </Label>
                  <Textarea
                    id="biography"
                    placeholder="Tell us about their life, passions, and the memories they created..."
                    className="min-h-64 resize-none bg-background/50"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Need help? Our AI can suggest gentle wording to honor their memory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-serif mb-3 text-permanence">Add Photos</h1>
                <p className="text-muted-foreground">Pictures help tell their story. Choose your favorites.</p>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-background/30">
                <Heart className="w-12 h-12 text-earth mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop photos here, or click to browse
                </p>
                <Button variant="outline">Choose Photos</Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-6">
                <p className="text-sm text-muted-foreground text-center">
                  You can always add more photos and memories later.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
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

            {step < 3 ? (
              <Button variant="hero" onClick={handleNext} className="gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit} className="gap-2">
                Create Memorial
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateTribute;
