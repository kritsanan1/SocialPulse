
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Success() {
  const { data: subscriptionData, refetch } = useQuery({
    queryKey: ["/api/subscription"],
  });

  useEffect(() => {
    // Refetch subscription data to get the latest status
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Subscription Successful!</CardTitle>
          <CardDescription>
            Welcome to SocialAI Pro! Your subscription has been activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {subscriptionData?.plan && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">
                {subscriptionData.plan.name} Plan
              </p>
              <p className="text-sm text-blue-600">
                ${subscriptionData.plan.price}/month
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              You can now access all the features included in your plan.
            </p>
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your inbox.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={() => window.location.href = "/"}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/billing"}>
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
