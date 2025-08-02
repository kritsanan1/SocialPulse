
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, Zap, Crown, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limits: {
    accounts: number | string;
    posts: number | string;
    analytics: string;
    teamMembers?: number | string;
    support: string;
  };
}

interface PricingData {
  plans: PricingPlan[];
  currency: string;
}

export default function Pricing() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: pricingData, isLoading: isPricingLoading } = useQuery<PricingData>({
    queryKey: ["/api/pricing"],
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ["/api/subscription"],
    enabled: !!user,
  });

  const createCheckoutSessionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error);
    },
    onSettled: () => {
      setLoadingPlan(null);
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = "/api/login";
      return;
    }

    setLoadingPlan(planId);
    createCheckoutSessionMutation.mutate(planId);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="w-6 h-6 text-blue-600" />;
      case 'pro':
        return <Crown className="w-6 h-6 text-purple-600" />;
      case 'enterprise':
        return <Building className="w-6 h-6 text-orange-600" />;
      default:
        return <Zap className="w-6 h-6 text-blue-600" />;
    }
  };

  const getCurrentPlanId = () => {
    return subscriptionData?.subscription?.plan || null;
  };

  if (isPricingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered social media management with our flexible pricing plans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingData?.plans.map((plan) => {
            const isCurrentPlan = getCurrentPlanId() === plan.id;
            const isPopular = plan.id === 'pro';
            
            return (
              <Card key={plan.id} className={`relative ${isPopular ? 'border-purple-500 shadow-lg scale-105' : ''}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {isCurrentPlan ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loadingPlan === plan.id}
                      variant={isPopular ? "default" : "outline"}
                    >
                      {loadingPlan === plan.id ? "Processing..." : "Get Started"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 Support</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}
