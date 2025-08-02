
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { CalendarDays, Clock, Send, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { format, addDays, isSameDay } from 'date-fns';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduled_for: Date;
  status: 'scheduled' | 'published' | 'failed' | 'draft';
  media_urls: string[];
  hashtags: string[];
  created_at: Date;
}

export default function SocialMediaScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    scheduled_date: '',
    scheduled_time: '',
    hashtags: '',
    auto_post: true
  });

  const platforms = [
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: '📘' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-black', icon: '🎵' },
    { id: 'pinterest', name: 'Pinterest', color: 'bg-red-500', icon: '📌' }
  ];

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/posts/scheduled');
      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.posts.map((post: any) => ({
          ...post,
          scheduled_for: new Date(post.scheduled_for),
          created_at: new Date(post.created_at)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSchedulePost = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    if (!formData.scheduled_date || !formData.scheduled_time) {
      toast({
        title: "Error",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);
      
      const response = await fetch('/api/posts/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          platforms: formData.platforms,
          scheduled_for: scheduledDateTime.toISOString(),
          hashtags: formData.hashtags.split(' ').filter(tag => tag.startsWith('#')),
          auto_post: formData.auto_post
        })
      });

      if (!response.ok) throw new Error('Failed to schedule post');

      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });

      setIsCreateDialogOpen(false);
      setFormData({
        content: '',
        platforms: [],
        scheduled_date: '',
        scheduled_time: '',
        hashtags: '',
        auto_post: true
      });
      
      fetchScheduledPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete post');

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchScheduledPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => isSameDay(post.scheduled_for, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Content Scheduler</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Post</DialogTitle>
              <DialogDescription>
                Create and schedule content across multiple platforms
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {formData.content.length} characters
                </div>
              </div>

              <div>
                <Label>Target Platforms</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {platforms.map(platform => (
                    <div
                      key={platform.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.platforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{platform.icon}</span>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Schedule Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Schedule Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hashtags">Hashtags (optional)</Label>
                <Input
                  id="hashtags"
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                  value={formData.hashtags}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-post">Auto-post when scheduled</Label>
                <Switch
                  id="auto-post"
                  checked={formData.auto_post}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_post: checked }))}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setIsCreateDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSchedulePost} disabled={isLoading}>
                  {isLoading ? 'Scheduling...' : 'Schedule Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view scheduled posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasPost: (date) => getPostsForDate(date).length > 0
                }}
                modifiersClassNames={{
                  hasPost: "bg-blue-100 text-blue-900"
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Posts for Selected Date */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Posts for {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {getPostsForDate(selectedDate).length} posts scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getPostsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No posts scheduled for this date</p>
                  </div>
                ) : (
                  getPostsForDate(selectedDate).map((post) => (
                    <Card key={post.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{format(post.scheduled_for, 'h:mm a')}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md mb-3">
                          <p className="text-sm">{post.content}</p>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.platforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <Badge key={platformId} variant="outline" className="text-xs">
                                {platform.icon} {platform.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>

                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.hashtags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
