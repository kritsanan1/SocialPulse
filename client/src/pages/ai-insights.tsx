import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, TrendingUp, Users, Target, Zap, Brain, BarChart } from "lucide-react";

export default function AIInsightsPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: aiSuggestions, isLoading: isLoadingAI } = useQuery({
    queryKey: ["/api/ai-suggestions"],
    enabled: isAuthenticated,
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics/summary"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mockInsights = [
    {
      id: 1,
      type: "Best Time to Post",
      icon: Target,
      title: "Optimal Posting Times",
      description: "Your audience is most active on weekdays between 9-11 AM and 2-4 PM",
      impact: "High",
      actionable: true
    },
    {
      id: 2,
      type: "Content Performance",
      icon: TrendingUp,
      title: "Top Performing Content Types",
      description: "Images with quotes perform 40% better than text-only posts",
      impact: "Medium",
      actionable: true
    },
    {
      id: 3,
      type: "Audience Analysis",
      icon: Users,
      title: "Audience Demographics",
      description: "Your primary audience is 25-34 year olds interested in technology and business",
      impact: "High",
      actionable: false
    },
    {
      id: 4,
      type: "Hashtag Optimization",
      icon: Zap,
      title: "Hashtag Strategy",
      description: "Use 5-7 hashtags per post for maximum reach. Mix trending and niche tags",
      impact: "Medium",
      actionable: true
    },
    {
      id: 5,
      type: "Engagement Boost",
      icon: Brain,
      title: "Engagement Patterns",
      description: "Posts with questions receive 60% more comments than statements",
      impact: "High",
      actionable: true
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  AI-powered recommendations to optimize your social media strategy
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Brain className="w-4 h-4 mr-2" />
                Generate New Insights
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockInsights.length}</div>
                  <p className="text-xs text-muted-foreground">
                    AI-generated recommendations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">High Impact</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockInsights.filter(i => i.impact === "High").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Priority recommendations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Actionable</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockInsights.filter(i => i.actionable).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ready to implement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Grid */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personalized Recommendations
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockInsights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <Badge variant="outline" className="text-xs mb-2">
                                {insight.type}
                              </Badge>
                              <CardTitle className="text-lg">{insight.title}</CardTitle>
                            </div>
                          </div>
                          <Badge 
                            variant={insight.impact === "High" ? "default" : "secondary"}
                            className={
                              insight.impact === "High" 
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }
                          >
                            {insight.impact} Impact
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={insight.actionable ? "default" : "secondary"}>
                            {insight.actionable ? "Actionable" : "Informational"}
                          </Badge>
                          {insight.actionable && (
                            <Button size="sm" variant="outline">
                              Apply Recommendation
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Performance Metrics */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Content Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analyticsData?.avgEngagement || "0.0"}%
                      </div>
                      <p className="text-sm text-muted-foreground">Average Engagement</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analyticsData?.totalReach?.toLocaleString() || "0"}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Reach</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {analyticsData?.totalPosts || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}