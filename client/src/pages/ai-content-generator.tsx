
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Sparkles, Copy, RefreshCw, Send, Calendar, Target, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  tone: string;
  length: number;
  engagement_score: number;
}

export default function AIContentGenerator() {
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [tone, setTone] = useState('professional');
  const [contentLength, setContentLength] = useState([50]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const { toast } = useToast();

  const platforms = [
    { id: 'twitter', name: 'Twitter', limit: 280, color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', limit: 2000, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', limit: 2200, color: 'bg-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', limit: 1300, color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', limit: 150, color: 'bg-black' },
    { id: 'pinterest', name: 'Pinterest', limit: 500, color: 'bg-red-500' }
  ];

  const tones = [
    'professional', 'casual', 'humorous', 'inspirational', 
    'educational', 'promotional', 'conversational', 'urgent'
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic or theme",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai-content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          tone,
          length: contentLength[0],
          include_hashtags: includeHashtags,
          include_emojis: includeEmojis
        })
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      setGeneratedContent(data.content);

      toast({
        title: "Success",
        description: `Generated ${data.content.length} pieces of content`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const schedulePost = (content: GeneratedContent) => {
    // Implementation for scheduling
    toast({
      title: "Schedule",
      description: "Opening scheduler...",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">AI Content Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>Configure your content generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="topic">Topic or Theme</Label>
                <Textarea
                  id="topic"
                  placeholder="Enter your topic, keywords, or content theme..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Target Platforms</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {platforms.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Switch
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <Label htmlFor={platform.id} className="text-sm">
                        {platform.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Content Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(t => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content Length: {contentLength[0]} words</Label>
                <Slider
                  value={contentLength}
                  onValueChange={setContentLength}
                  max={200}
                  min={10}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hashtags">Include Hashtags</Label>
                  <Switch
                    id="hashtags"
                    checked={includeHashtags}
                    onCheckedChange={setIncludeHashtags}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emojis">Include Emojis</Label>
                  <Switch
                    id="emojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                </div>
              </div>

              <Button 
                onClick={generateContent} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                AI-generated content optimized for your selected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate content to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map((content) => (
                    <Card key={content.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {platforms.find(p => p.id === content.platform)?.name}
                            </Badge>
                            <Badge variant="outline">
                              {content.tone}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              <span>{content.engagement_score}% engagement</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md mb-3">
                          <p className="whitespace-pre-wrap">{content.content}</p>
                        </div>

                        {content.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {content.hashtags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>{content.length} characters</span>
                          <span>
                            {platforms.find(p => p.id === content.platform)?.limit} limit
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyContent(content.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => schedulePost(content)}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm">
                            <Send className="h-3 w-3 mr-1" />
                            Post Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
