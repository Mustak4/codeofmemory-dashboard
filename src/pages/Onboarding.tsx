import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CodeOfMemory</CardTitle>
            <CardDescription>Let&apos;s get your memorial experience set up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This onboarding flow will help you confirm your purchase, claim your memorial, and start crafting the
              story you want to share.
            </p>
            <Button disabled>Begin onboarding (coming soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;


