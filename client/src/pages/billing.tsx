
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CreditCard, Download, Settings, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Billing() {
  const { user } = useAuth();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["/api/subscription"],
    enabled: !!user,
  });

  const { data: billingHistory, isLoading: isBillingLoading } = useQuery({
    queryKey: ["/api/billing-history"],
    enabled: !!user,
  });

  const { data: usageData, isLoading: isUsageLoading } = useQuery({
    queryKey: ["/api/usage"],
    enabled: !!user,
  });

  const createPortalSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create portal session");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Portal error:", error);
    },
    onSettled: () => {
      setIsLoadingPortal(false);
    },
  });

  const handleManageSubscription = () => {
    setIsLoadingPortal(true);
    createPortalSessionMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Active" },
      canceled: { color: "bg-red-100 text-red-800", text: "Canceled" },
      past_due: { color: "bg-yellow-100 text-yellow-800", text: "Past Due" },
      incomplete: { color: "bg-gray-100 text-gray-800", text: "Incomplete" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.incomplete;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const calculateUsagePercentage = (current: number, limit: number | string) => {
    if (limit === 'unlimited') return 0;
    return Math.min((current / Number(limit)) * 100, 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to view your billing information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = "/api/login"}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubscriptionLoading || isBillingLoading || isUsageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Usage</h1>
          <p className="text-gray-600">Manage your subscription and monitor your usage.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionData?.subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold capitalize">
                      {subscriptionData.plan?.name || 'Unknown Plan'}
                    </span>
                    {getStatusBadge(subscriptionData.subscription.status)}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Current Period:</strong>{" "}
                      {format(new Date(subscriptionData.subscription.currentPeriodStart), "MMM dd, yyyy")} -{" "}
                      {format(new Date(subscriptionData.subscription.currentPeriodEnd), "MMM dd, yyyy")}
                    </p>
                    {subscriptionData.subscription.cancelAtPeriodEnd && (
                      <p className="text-red-600 mt-2">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Subscription will be canceled at the end of the current period.
                      </p>
                    )}
                  </div>

                  <Button onClick={handleManageSubscription} disabled={isLoadingPortal}>
                    <Settings className="w-4 h-4 mr-2" />
                    {isLoadingPortal ? "Loading..." : "Manage Subscription"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">No active subscription</p>
                  <Button onClick={() => window.location.href = "/pricing"}>
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>
                {usageData?.month && format(new Date(usageData.month + "-01"), "MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usageData?.usage && usageData?.limits ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Posts Created</span>
                      <span>
                        {usageData.usage.postsCreated || 0} / {usageData.limits.posts}
                      </span>
                    </div>
                    <Progress 
                      value={calculateUsagePercentage(
                        usageData.usage.postsCreated || 0, 
                        usageData.limits.posts
                      )} 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Connected Accounts</span>
                      <span>
                        {usageData.usage.accountsConnected || 0} / {usageData.limits.accounts}
                      </span>
                    </div>
                    <Progress 
                      value={calculateUsagePercentage(
                        usageData.usage.accountsConnected || 0, 
                        usageData.limits.accounts
                      )} 
                    />
                  </div>

                  {usageData.limits.teamMembers && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Team Members</span>
                        <span>
                          {usageData.usage.teamMembersAdded || 0} / {usageData.limits.teamMembers}
                        </span>
                      </div>
                      <Progress 
                        value={calculateUsagePercentage(
                          usageData.usage.teamMembersAdded || 0, 
                          usageData.limits.teamMembers
                        )} 
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Generations</span>
                      <span>{usageData.usage.aiGenerationsUsed || 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No usage data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your recent invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            {billingHistory && billingHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>
                        ${Number(record.amount).toFixed(2)} {record.currency.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        {record.invoiceUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={record.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600 text-center py-8">No billing history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
