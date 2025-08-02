
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RefreshCw, Recycle, TrendingUp, Copy, Eye, Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ContentRecycling() {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [minEngagement, setMinEngagement] = useState("");
  const [transformFormat, setTransformFormat] = useState("");

  const { data: postHistory, isLoading: isLoadingHistory, refetch } = useQuery({
    queryKey: ["/api/content-recycling/history", { platform: selectedPlatform, minEngagement }],
    enabled: !!user,
  });

  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["/api/content-recycling/suggestions"],
    enabled: !!user,
  });

  const transformContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content-recycling/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to transform content");
      return response.json();
    },
  });

  const handleTransform = (postId: string, format: string) => {
    transformContentMutation.mutate({
      originalPostId: postId,
      targetFormat: format,
      targetPlatform: selectedPlatform
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to use Content Recycling.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Recycle className="w-8 h-8 mr-3 text-green-600" />
            Content Recycling Engine
          </h1>
          <p className="text-gray-600">Transform your high-performing content into new formats and reach new audiences.</p>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Post History</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="transform">Transform Content</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter High-Performing Content</CardTitle>
                <CardDescription>Find your best posts to transform into new content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All platforms</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min. Engagement Rate</label>
                    <Select value={minEngagement} onValueChange={setMinEngagement}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Any engagement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any engagement</SelectItem>
                        <SelectItem value="3">3%+</SelectItem>
                        <SelectItem value="4">4%+</SelectItem>
                        <SelectItem value="5">5%+</SelectItem>
                        <SelectItem value="6">6%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={() => refetch()} className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post History */}
            <div className="grid gap-4">
              {isLoadingHistory ? (
                <div className="text-center py-8">Loading posts...</div>
              ) : postHistory?.posts?.map((post: any) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{post.platform}</Badge>
                          <Badge variant={post.engagementRate > 5 ? "default" : "secondary"}>
                            {post.engagementRate}% engagement
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-3">{post.content}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>👍 {post.metrics.likes}</span>
                          <span>💬 {post.metrics.comments}</span>
                          <span>🔄 {post.metrics.shares}</span>
                          <span>👀 {post.metrics.reach}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleTransform(post.id, 'tweet-thread')}>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Transform
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI-Powered Recycling Suggestions
                </CardTitle>
                <CardDescription>
                  Our AI has analyzed your content and identified transformation opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSuggestions ? (
                  <div className="text-center py-8">Analyzing your content...</div>
                ) : (
                  <div className="space-y-6">
                    {suggestions?.suggestions?.map((suggestion: any) => (
                      <div key={suggestion.id} className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Original Post</h3>
                          <div className="bg-gray-50 rounded p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{suggestion.originalPost.platform}</Badge>
                              <Badge variant="secondary">{suggestion.originalPost.engagementRate}% engagement</Badge>
                            </div>
                            <p className="text-sm">{suggestion.originalPost.content}</p>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mb-3">Transformation Suggestions</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          {suggestion.suggestions.map((transform: any, index: number) => (
                            <div key={index} className="border rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{transform.format}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {transform.estimatedEffort}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{transform.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600 font-medium">
                                  {transform.potentialReach} reach
                                </span>
                                <Button size="sm" variant="outline">
                                  Create
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transform" className="space-y-6">
            {transformContentMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Transformed Content</CardTitle>
                  <CardDescription>
                    AI-generated content based on your original post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transformContentMutation.data.transformed.content ? (
                      Array.isArray(transformContentMutation.data.transformed.content) ? (
                        transformContentMutation.data.transformed.content.map((tweet: string, index: number) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium">Tweet {index + 1}</span>
                              <Button variant="outline" size="sm">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <p className="text-sm">{tweet}</p>
                          </div>
                        ))
                      ) : (
                        <div className="border rounded p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium">{transformContentMutation.data.transformed.title}</h3>
                            <Button variant="outline" size="sm">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap text-sm">
                              {transformContentMutation.data.transformed.content}
                            </pre>
                          </div>
                        </div>
                      )
                    ) : null}
                    
                    {transformContentMutation.data.suggestions && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <h4 className="font-medium text-sm mb-2">Suggestions:</h4>
                        <ul className="text-sm space-y-1">
                          {transformContentMutation.data.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-blue-700">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
