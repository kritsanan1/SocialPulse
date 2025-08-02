
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Copy, RefreshCw, Hash, TrendingUp, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AIContentGenerator() {
  const { user } = useAuth();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [contentLength, setContentLength] = useState("");
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  const platforms = [
    { id: "twitter", name: "Twitter/X", limit: 280 },
    { id: "linkedin", name: "LinkedIn", limit: 3000 },
    { id: "facebook", name: "Facebook", limit: 2000 },
    { id: "instagram", name: "Instagram", limit: 2200 }
  ];

  const tones = [
    "Professional", "Casual", "Humorous", "Inspirational", 
    "Educational", "Promotional", "Personal", "News-worthy"
  ];

  const generateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to generate content");
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content || []);
      setHashtags(data.hashtags || []);
    },
  });

  const getTrendingTopicsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai/trending-topics");
      if (!response.ok) throw new Error("Failed to fetch trending topics");
      return response.json();
    },
    onSuccess: (data) => {
      setTrendingTopics(data.topics || []);
    },
  });

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = () => {
    if (!topic.trim() || selectedPlatforms.length === 0) return;
    
    generateContentMutation.mutate({
      topic,
      tone,
      contentLength,
      platforms: selectedPlatforms,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const useForPost = (content: string, platform: string) => {
    // Navigate to post creation with pre-filled content
    const params = new URLSearchParams({
      content,
      platform,
      hashtags: hashtags.join(" ")
    });
    window.location.href = `/?${params.toString()}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please log in to use the AI Content Generator.</CardDescription>
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
            <Sparkles className="w-8 h-8 mr-3 text-purple-600" />
            AI Content Generator
          </h1>
          <p className="text-gray-600">Generate engaging social media content powered by AI.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Content Parameters</CardTitle>
                <CardDescription>Define what you want to create</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="topic">Topic or Keywords</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., sustainable fashion, AI technology"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(toneOption => (
                        <SelectItem key={toneOption} value={toneOption.toLowerCase()}>
                          {toneOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Content Length</Label>
                  <Select value={contentLength} onValueChange={setContentLength}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                      <SelectItem value="long">Long (6+ sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {platforms.map(platform => (
                      <Button
                        key={platform.id}
                        variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className="text-xs"
                      >
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic.trim() || selectedPlatforms.length === 0 || generateContentMutation.isPending}
                  className="w-full"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getTrendingTopicsMutation.mutate()}
                  disabled={getTrendingTopicsMutation.isPending}
                  className="w-full mb-3"
                >
                  {getTrendingTopicsMutation.isPending ? "Loading..." : "Refresh Trends"}
                </Button>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => setTopic(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Generated Content</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags & Ideas</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                {generatedContent.length > 0 ? (
                  generatedContent.map((content, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {platforms.find(p => p.id === content.platform)?.name}
                          </CardTitle>
                          <Badge variant="outline">
                            {content.content.length} chars
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={content.content}
                          readOnly
                          className="min-h-[120px] mb-4"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(content.content)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => useForPost(content.content, content.platform)}
                          >
                            Use for Post
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Lightbulb className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-center">
                        Generate your first AI-powered content by filling out the form and clicking "Generate Content"
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="hashtags">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Hash className="w-5 h-5 mr-2" />
                      Suggested Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hashtags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((hashtag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-blue-100"
                            onClick={() => copyToClipboard(hashtag)}
                          >
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Generate content to see suggested hashtags
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
