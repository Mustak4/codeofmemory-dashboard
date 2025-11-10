import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Payment = () => {
  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment & Access</CardTitle>
            <CardDescription>Manage your plan and entitlements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscription management, invoices, and entitlement controls will live here. We&apos;re wiring up the
              Stripe integration next.
            </p>
            <Button disabled>Manage billing (coming soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;


