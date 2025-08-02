import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Calendar, Hash, Send, Loader2, X, MessageCircle, Users, Camera, Briefcase, Video, Image, Zap, PlayCircle, MessageSquare, Phone } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Platform configuration with proper icons and colors
const platforms: Platform[] = [
  { id: "twitter", name: "Twitter/X", icon: MessageCircle, color: "text-blue-500" },
  { id: "facebook", name: "Facebook", icon: Users, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: Camera, color: "text-pink-500" },
  { id: "linkedin", name: "LinkedIn", icon: Briefcase, color: "text-blue-700" },
  { id: "tiktok", name: "TikTok", icon: Video, color: "text-black dark:text-white" },
  { id: "pinterest", name: "Pinterest", icon: Image, color: "text-red-600" },
  { id: "snapchat", name: "Snapchat", icon: Zap, color: "text-yellow-400" },
  { id: "youtube", name: "YouTube", icon: PlayCircle, color: "text-red-600" },
  { id: "reddit", name: "Reddit", icon: MessageSquare, color: "text-orange-600" },
  { id: "telegram", name: "Telegram", icon: Phone, color: "text-blue-500" },
];

export function PostCreationForm() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [profileKey, setProfileKey] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<Array<{
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/ayrshare/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedMedia(prev => [...prev, data]);
      toast({
        title: "Upload successful",
        description: `${data.filename} uploaded successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Post creation mutation
  const postMutation = useMutation({
    mutationFn: async (postData: {
      post: string;
      platforms: string[];
      mediaUrls?: string[];
      scheduleDate?: string;
      profileKey?: string;
    }) => {
      return apiRequest('/api/ayrshare/post', 'POST', postData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post sent successfully",
        description: `Your post has been ${data.ayrshareResponse?.posts ? 'published' : 'scheduled'} to ${selectedPlatforms.length} platform(s)`,
      });
      
      // Reset form
      setContent("");
      setSelectedPlatforms([]);
      setScheduleDate("");
      setScheduleTime("");
      setProfileKey("");
      setUploadedMedia([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Post failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      post: content,
      platforms: selectedPlatforms,
      ...(uploadedMedia.length > 0 && { mediaUrls: uploadedMedia.map(m => m.url) }),
      ...(scheduleDate && scheduleTime && { 
        scheduleDate: `${scheduleDate}T${scheduleTime}:00.000Z` 
      }),
      ...(profileKey && { profileKey }),
    };

    await postMutation.mutateAsync(postData);
  };

  const characterCount = content.length;
  const maxCharacters = 280; // Twitter limit as baseline

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Create New Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 resize-none"
              maxLength={maxCharacters * 2} // Allow more for platforms that support it
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Share your thoughts across multiple platforms</span>
              <span className={characterCount > maxCharacters ? "text-destructive" : ""}>
                {characterCount}/{maxCharacters * 2}
              </span>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <Label>Select Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <div
                    key={platform.id}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }
                    `}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <IconComponent className={`w-6 h-6 mb-2 ${platform.color}`} />
                    <span className="text-xs font-medium text-center leading-tight">
                      {platform.name}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-2"
                    />
                  </div>
                );
              })}
            </div>
            {selectedPlatforms.length === 0 && (
              <Alert>
                <Hash className="h-4 w-4" />
                <AlertDescription>
                  Select at least one platform to publish your post
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Media (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="media-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Images & videos up to 50MB
              </span>
            </div>
            
            {/* Uploaded Media Preview */}
            {uploadedMedia.length > 0 && (
              <div className="space-y-2">
                {uploadedMedia.map((media, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{media.filename}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(media.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Schedule Date (Optional)</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Schedule Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                disabled={!scheduleDate}
              />
            </div>
          </div>

          {/* Profile Key */}
          <div className="space-y-2">
            <Label htmlFor="profile-key">Profile Key (Optional)</Label>
            <Input
              id="profile-key"
              placeholder="For team or business accounts"
              value={profileKey}
              onChange={(e) => setProfileKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use profile keys to post on behalf of different accounts or team members
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={postMutation.isPending || !content.trim() || selectedPlatforms.length === 0}
          >
            {postMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {scheduleDate ? 'Scheduling...' : 'Publishing...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {scheduleDate ? 'Schedule Post' : 'Publish Now'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}