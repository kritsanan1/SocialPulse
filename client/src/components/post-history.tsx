import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  platforms: string[];
  scheduleDate: string;
  status: string;
  createdAt: string;
}

export function PostHistory() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bg-blue-100 text-blue-800";
      case "facebook":
        return "bg-blue-100 text-blue-800";
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "linkedin":
        return "bg-blue-100 text-blue-800";
      case "tiktok":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Posts</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-secondary">
            <ExternalLink className="w-4 h-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {posts?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2">No posts yet</p>
            <p className="text-sm">Create your first post to see it here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.slice(0, 5).map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {format(new Date(post.scheduleDate), "MMM d, yyyy h:mm a")}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span>Platforms:</span>
                        <div className="flex space-x-1">
                          {post.platforms.map((platform) => (
                            <Badge
                              key={platform}
                              variant="outline"
                              className={`text-xs ${getPlatformColor(platform)}`}
                            >
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <Badge
                      variant="outline"
                      className={`mb-2 ${getStatusColor(post.status)}`}
                    >
                      {post.status}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {post.status === "published" ? "142 engagements" : "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts && posts.length > 5 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full text-center text-primary hover:text-secondary font-medium text-sm">
              Load More Posts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
