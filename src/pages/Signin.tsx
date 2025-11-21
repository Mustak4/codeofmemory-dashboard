import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const emailRegex =
  // simple validation; real validation handled server-side
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signin = () => {
  const { user, loading, signIn, verifyPurchaseAndLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifyingPurchase, setVerifyingPurchase] = useState(false);

  // Handle purchase redirect from codeofmemory.com
  useEffect(() => {
    const purchaseToken = searchParams.get("purchase_token");
    const emailParam = searchParams.get("email");
    
    if (!loading && !user && purchaseToken) {
      (async () => {
        try {
          setVerifyingPurchase(true);
          setSubmitting(true);
          const result = await verifyPurchaseAndLogin(purchaseToken, emailParam || undefined);
          
          if (result.success) {
            toast({ 
              title: "Purchase verified", 
              description: "Welcome! Your account has been created. Let's set up your memorial." 
            });
            // Redirect to onboarding after purchase
            navigate("/onboarding", { replace: true });
          } else {
            toast({ 
              title: "Verification failed", 
              description: result.error || "Could not verify your purchase. Please contact support.",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({ 
            title: "Error", 
            description: "An error occurred during purchase verification. Please try again.",
            variant: "destructive"
          });
        } finally {
          setVerifyingPurchase(false);
          setSubmitting(false);
        }
      })();
    }
  }, [searchParams, loading, user, verifyPurchaseAndLogin, navigate, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email." });
      return;
    }

    if (!password) {
      toast({ title: "Password required", description: "Please enter your password." });
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast({ title: "Signed in", description: "Welcome back!" });
        navigate("/dashboard", { replace: true });
      } else {
        toast({ 
          title: "Sign in failed", 
          description: result.error || "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) {
    return null;
  }

  // Show loading state when verifying purchase
  if (verifyingPurchase) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying your purchase</CardTitle>
            <CardDescription>Please wait while we set up your account...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your email and password to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our terms and privacy policy.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;


