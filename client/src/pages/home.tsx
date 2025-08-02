import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { PostCreationForm } from "@/components/post-creation-form";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, BarChart3, Users, Calendar, TrendingUp, Send, LineChart, Lightbulb } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to home if not authenticated
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

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics/summary"],
    enabled: isAuthenticated,
  });

  const { data: aiSuggestions, isLoading: isLoadingAI } = useQuery({
    queryKey: ["/api/ai-suggestions"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}!
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your social media presence across all platforms with AI-powered insights
                </p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setActiveTab("create")}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Create Post
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  AI Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingPosts ? "..." : (posts?.length || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Posts created this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingAnalytics ? "..." : (analyticsData?.avgEngagement || "0.0")}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across all platforms
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingAnalytics ? "..." : (analyticsData?.totalReach?.toLocaleString() || "0")}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        People reached
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingAI ? "..." : (aiSuggestions?.length || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ready to apply
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Posts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPosts ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            </div>
                          ))}
                        </div>
                      ) : posts && posts.length > 0 ? (
                        <div className="space-y-4">
                          {posts.slice(0, 5).map((post: any) => (
                            <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  {post.platforms?.map((platform: string) => (
                                    <Badge key={platform} variant="secondary" className="text-xs">
                                      {platform}
                                    </Badge>
                                  ))}
                                </div>
                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                  {post.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            No posts yet. Create your first post to get started!
                          </p>
                          <Button onClick={() => setActiveTab("create")} size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Post
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingAI ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      ) : aiSuggestions && aiSuggestions.length > 0 ? (
                        <div className="space-y-4">
                          {aiSuggestions.slice(0, 5).map((suggestion: any) => (
                            <div key={suggestion.id} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <Badge variant="outline" className="text-xs mb-2">
                                    {suggestion.suggestionType}
                                  </Badge>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {suggestion.suggestionContent}
                                  </p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  Apply
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            No AI suggestions available yet. Create some posts to get personalized recommendations!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="create">
                <PostCreationForm />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Content Insights</CardTitle>
                    <p className="text-muted-foreground">
                      Get intelligent suggestions to improve your social media performance
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAI ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse border rounded-lg p-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : aiSuggestions && aiSuggestions.length > 0 ? (
                      <div className="space-y-4">
                        {aiSuggestions.map((suggestion: any) => (
                          <div key={suggestion.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <Badge variant="outline">
                                  {suggestion.suggestionType}
                                </Badge>
                              </div>
                              <Button size="sm" variant="outline">
                                Apply Suggestion
                              </Button>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                              {suggestion.suggestionContent}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Generated for your content strategy
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No AI Suggestions Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Our AI will analyze your content and audience to provide personalized suggestions. 
                          Create a few posts to get started!
                        </p>
                        <Button onClick={() => setActiveTab("create")}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create Your First Post
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}