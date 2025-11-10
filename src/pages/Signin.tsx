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
  const { user, loading, requestMagicLink, completeMagicLink } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);


  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");

  useEffect(() => {
    const mode = searchParams.get("mode");
    const emailParam = searchParams.get("email");
    if (mode === "verify" && emailParam) {
      setEmail(emailParam);
      setStep("verify");
    }
  }, [searchParams]);

  useEffect(() => {
    const autoLogin = searchParams.get("autologin");
    const emailParam = searchParams.get("email");
    if (!loading && !user && autoLogin === "1" && emailParam) {
      (async () => {
        try {
          setSubmitting(true);
          await completeMagicLink(emailParam);
          toast({ title: "Signed in", description: `Welcome, ${emailParam}` });
          navigate("/dashboard", { replace: true });
        } catch {
          toast({ title: "Error", description: "Auto-login failed." });
        } finally {
          setSubmitting(false);
        }
      })();
    }
  }, [searchParams, loading, user, completeMagicLink, navigate, toast]);

  const handleRequest = async () => {
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email." });
      return;
    }
    setSubmitting(true);
    try {
      await requestMagicLink(email);
      toast({
        title: "Check your inbox",
        description: "We sent a sign-in link. Click it to continue.",
      });
      // For MVP, simulate immediate verify step
      setStep("verify");
    } catch {
      toast({ title: "Error", description: "Could not send magic link. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await completeMagicLink(email);
      toast({ title: "Signed in", description: "Welcome back!" });
    } catch {
      toast({ title: "Error", description: "Could not complete sign in. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your email to get a magic sign-in link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            />
          </div>
          {step === "request" ? (
            <Button className="w-full" disabled={submitting} onClick={handleRequest}>
              {submitting ? "Sending..." : "Send magic link"}
            </Button>
          ) : (
            <Button className="w-full" disabled={submitting} onClick={handleComplete}>
              {submitting ? "Signing in..." : "I clicked the link (continue)"}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true);
                const demoEmail = "demo@codeofmemory.com";
                await completeMagicLink(demoEmail);
                toast({ title: "Signed in (demo)", description: `Welcome, ${demoEmail}` });
                navigate("/dashboard", { replace: true });
              } catch {
                toast({ title: "Error", description: "Demo sign-in failed." });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Use demo account
          </Button>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;


