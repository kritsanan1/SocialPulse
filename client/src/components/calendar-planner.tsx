import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay, parseISO } from "date-fns";
import { Plus, Clock, Users, Eye } from "lucide-react";
import { PostCreationForm } from "./post-creation-form";

interface ScheduledPost {
  id: string;
  content: string;
  scheduledDate: string;
  platforms: string[];
  status: string;
  mediaUrls?: string[];
}

export function CalendarPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: scheduledPosts, isLoading } = useQuery({
    queryKey: ["/api/posts/scheduled"],
  });

  // Get posts for selected date
  const postsForSelectedDate = scheduledPosts?.filter((post: ScheduledPost) => 
    selectedDate && isSameDay(parseISO(post.scheduledDate), selectedDate)
  ) || [];

  // Get dates with scheduled posts for calendar highlighting
  const datesWithPosts = scheduledPosts?.map((post: ScheduledPost) => 
    parseISO(post.scheduledDate)
  ) || [];

  const modifiers = {
    hasPost: datesWithPosts,
  };

  const modifiersStyles = {
    hasPost: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '50%',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Calendar</h2>
          <p className="text-muted-foreground">Plan and schedule your social media posts</p>
        </div>
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Scheduled Post</DialogTitle>
            </DialogHeader>
            <PostCreationForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Posts for selected date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : postsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {postsForSelectedDate.map((post: ScheduledPost) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={post.status === 'scheduled' ? 'secondary' : 'default'}>
                          {post.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(post.scheduledDate), 'HH:mm')}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium mb-2 line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {post.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {post.mediaUrls.length} media file{post.mediaUrls.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No posts scheduled for this date
                  </p>
                  <Button 
                    onClick={() => setShowCreatePost(true)} 
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {/* Days of the week with post counts */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const dayPosts = scheduledPosts?.filter((post: ScheduledPost) => {
                const postDate = parseISO(post.scheduledDate);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + index);
                return isSameDay(postDate, weekStart);
              }) || [];

              return (
                <div key={day} className="text-center">
                  <div className="font-medium text-sm mb-2">{day}</div>
                  <div className="h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                    {dayPosts.length > 0 ? (
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{dayPosts.length}</div>
                        <div className="text-xs text-muted-foreground">
                          post{dayPosts.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">No posts</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}