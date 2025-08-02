
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Heart, 
  MessageCircle, 
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SentimentDashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("30d");
  const [platforms, setPlatforms] = useState("");

  const { data: sentimentOverview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["/api/sentiment/overview", { timeframe, platforms }],
    enabled: !!user,
  });

  const { data: sentimentTrends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ["/api/sentiment/trends", { timeframe }],
    enabled: !!user,
  });

  const { data: sentimentAlerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["/api/sentiment/alerts"],
    enabled: !!user,
  });

  const { data: postsSentiment, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/sentiment/posts"],
    enabled: !!user,
  });

  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return "text-green-600";
    if (score >= 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentBadgeVariant = (classification: string) => {
    switch (classification) {
      case 'positive': return "default";
      case 'negative': return "destructive";
      default: return "secondary";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to view Sentiment Analysis.</CardDescription>
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
            <Heart className="w-8 h-8 mr-3 text-pink-600" />
            Sentiment Analysis Dashboard
          </h1>
          <p className="text-gray-600">Monitor brand sentiment and track audience emotions across all platforms.</p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-end">
              <div>
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="mt-1 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select value={platforms} onValueChange={setPlatforms}>
                  <SelectTrigger className="mt-1 w-40">
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
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="posts">Post Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Sentiment */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Overall Sentiment</p>
                      <p className={`text-2xl font-bold ${getSentimentColor(sentimentOverview?.overall?.score || 0)}`}>
                        {(sentimentOverview?.overall?.score * 100)?.toFixed(0) || 0}%
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={sentimentOverview?.overall?.classification === 'Positive' ? 'default' : 'secondary'}>
                      {sentimentOverview?.overall?.classification || 'Neutral'}
                    </Badge>
                    <span className="text-sm text-green-600">
                      {sentimentOverview?.overall?.trend || '+0%'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Positive</p>
                      <p className="text-2xl font-bold text-green-600">
                        {sentimentOverview?.breakdown?.positive || 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Neutral</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {sentimentOverview?.breakdown?.neutral || 0}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Negative</p>
                      <p className="text-2xl font-bold text-red-600">
                        {sentimentOverview?.breakdown?.negative || 0}%
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>Sentiment analysis across different social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(sentimentOverview?.platformBreakdown || {}).map(([platform, data]: [string, any]) => (
                    <div key={platform} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium capitalize">{platform}</h3>
                        <Badge variant="outline" className={getSentimentColor(data.score)}>
                          {(data.score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Positive</span>
                          <span>{data.positive}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Neutral</span>
                          <span>{data.neutral}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-600">Negative</span>
                          <span>{data.negative}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>Keywords and topics driving sentiment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {sentimentOverview?.trending?.topics?.map((topic: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{topic.keyword}</p>
                        <p className="text-sm text-gray-600">{topic.mentions} mentions</p>
                      </div>
                      <Badge variant={topic.sentiment > 0.6 ? 'default' : topic.sentiment > 0.3 ? 'secondary' : 'destructive'}>
                        {(topic.sentiment * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trends Over Time</CardTitle>
                <CardDescription>Track how sentiment changes over your selected timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTrends ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Loading trends...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                    
                    {sentimentTrends?.insights && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {sentimentTrends.insights.map((insight: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">💡 {insight}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post-Level Sentiment Analysis</CardTitle>
                <CardDescription>Detailed sentiment breakdown for individual posts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div className="text-center py-8">Loading post analysis...</div>
                ) : (
                  <div className="space-y-4">
                    {postsSentiment?.posts?.map((post: any) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{post.platform}</Badge>
                              <Badge variant={getSentimentBadgeVariant(post.sentiment.breakdown.positive > 60 ? 'positive' : post.sentiment.breakdown.negative > 30 ? 'negative' : 'neutral')}>
                                {(post.sentiment.overall * 100).toFixed(0)}% sentiment
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-3">{post.content}</p>
                          </div>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-3 mb-4">
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-sm text-green-600">Positive</p>
                            <p className="font-bold text-green-700">{post.sentiment.breakdown.positive}%</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Neutral</p>
                            <p className="font-bold text-gray-700">{post.sentiment.breakdown.neutral}%</p>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded">
                            <p className="text-sm text-red-600">Negative</p>
                            <p className="font-bold text-red-700">{post.sentiment.breakdown.negative}%</p>
                          </div>
                        </div>

                        {post.comments && post.comments.length > 0 && (
                          <div className="border-t pt-3">
                            <h4 className="font-medium mb-2">Sample Comments</h4>
                            <div className="space-y-2">
                              {post.comments.slice(0, 3).map((comment: any) => (
                                <div key={comment.id} className="text-sm p-2 bg-gray-50 rounded">
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-gray-800">{comment.text}</p>
                                    <Badge size="sm" variant={getSentimentBadgeVariant(comment.sentiment.classification)}>
                                      {comment.sentiment.classification}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Sentiment Alerts
                </CardTitle>
                <CardDescription>Real-time notifications about sentiment changes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAlerts ? (
                  <div className="text-center py-8">Loading alerts...</div>
                ) : sentimentAlerts?.alerts?.length > 0 ? (
                  <div className="space-y-4">
                    {sentimentAlerts.alerts.map((alert: any) => (
                      <div key={alert.id} className={`border-l-4 p-4 rounded ${
                        alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{alert.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.platform}</Badge>
                          </div>
                        </div>
                        
                        {alert.actionRequired && alert.suggestedActions && (
                          <div className="mt-3 p-3 bg-white rounded">
                            <h4 className="font-medium text-sm mb-2">Suggested Actions:</h4>
                            <ul className="text-sm space-y-1">
                              {alert.suggestedActions.map((action: string, index: number) => (
                                <li key={index} className="text-gray-700">• {action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          {alert.actionRequired && (
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active alerts. Your sentiment is looking good!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
