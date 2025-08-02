import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";

const platforms = [
  { id: "twitter", name: "Twitter", color: "bg-blue-400" },
  { id: "facebook", name: "Facebook", color: "bg-blue-600" },
  { id: "instagram", name: "Instagram", color: "bg-pink-500" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
  { id: "tiktok", name: "TikTok", color: "bg-black" },
];

const postSchema = z.object({
  content: z.string().min(1, "Content is required").max(500, "Content must be less than 500 characters"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  scheduleDate: z.string().min(1, "Schedule date is required"),
  profileKey: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export function PostCreationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      platforms: [],
      mediaUrl: "",
      scheduleDate: "",
      profileKey: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      // Validate schedule date is in the future
      const scheduleDate = new Date(data.scheduleDate);
      if (scheduleDate <= new Date()) {
        throw new Error("Schedule date must be in the future");
      }

      await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      form.reset();
      setSelectedPlatforms([]);
      toast({
        title: "Success",
        description: "Post scheduled successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const requestAISuggestionsMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/ai-suggestions", {
        suggestionContent: content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-suggestions"] });
      toast({
        title: "AI Suggestions Generated",
        description: "Check the AI suggestions panel for recommendations!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions",
        variant: "destructive",
      });
    },
  });

  const togglePlatform = (platformId: string) => {
    const updated = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(updated);
    form.setValue("platforms", updated);
  };

  const onSubmit = (data: PostFormData) => {
    createPostMutation.mutate(data);
  };

  const requestAISuggestions = () => {
    const content = form.getValues("content");
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some content first to get AI suggestions",
        variant: "destructive",
      });
      return;
    }
    requestAISuggestionsMutation.mutate(content);
  };

  const contentLength = form.watch("content")?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Content Input */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="What's on your mind? Share your thoughts with the world..."
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{contentLength} characters</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={requestAISuggestions}
                      disabled={requestAISuggestionsMutation.isPending}
                      className="text-primary hover:text-secondary"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {requestAISuggestionsMutation.isPending ? "Generating..." : "Get AI Suggestions"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Platform Selection */}
            <FormField
              control={form.control}
              name="platforms"
              render={() => (
                <FormItem>
                  <FormLabel>Select Platforms</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {platforms.map((platform) => (
                        <div
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPlatforms.includes(platform.id)
                              ? "border-primary bg-blue-50"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <div className={`w-8 h-8 mb-2 rounded ${platform.color} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">
                              {platform.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-700">{platform.name}</span>
                          {selectedPlatforms.includes(platform.id) && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center">
                                ✓
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media URL */}
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Date & Profile Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduleDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Key (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter profile key"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-secondary"
              disabled={createPostMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              {createPostMutation.isPending ? "Scheduling..." : "Schedule Post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
