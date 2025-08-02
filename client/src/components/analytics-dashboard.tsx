import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
// Using lucide icons instead of react-icons for simplicity
import { useState } from "react";

interface AyrshareHistoryItem {
  id: string;
  post: string;
  platforms: string[];
  scheduleDate: string;
  created: string;
  status: string;
  refId: string;
}

interface LocalPost {
  id: string;
  content: string;
  platforms: string[];
  status: string;
  createdAt: string;
  scheduleDate: string;
}

interface AnalyticsSummary {
  totalPosts: number;
  avgEngagement: string;
  totalReach: number;
  avgClickRate: string;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: MessageCircle,
  facebook: Users,
  instagram: Eye,
  linkedin: Users,
  tiktok: Heart,
};

const platformColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
  "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
];

export function AnalyticsDashboard() {
  const [profileKey, setProfileKey] = useState("");

  // Fetch Ayrshare history
  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['/api/ayrshare/history', profileKey],
    queryFn: async () => {
      const params = profileKey ? `?profileKey=${encodeURIComponent(profileKey)}` : '';
      const response = await fetch(`/api/ayrshare/history${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post history');
      }
      return response.json();
    },
  });

  // Fetch analytics summary
  const { data: analyticsSummary, isLoading: isLoadingAnalytics } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary'],
  });

  // Process data for charts
  const processedData = historyData ? {
    ayrshareHistory: historyData.ayrshareHistory || [],
    localHistory: historyData.localHistory || [],
  } : { ayrshareHistory: [], localHistory: [] };

  // Platform distribution data
  const platformData = processedData.ayrshareHistory.reduce((acc: Record<string, number>, post: AyrshareHistoryItem) => {
    post.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {});

  const platformChartData = Object.entries(platformData).map(([platform, count], index) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count,
    fill: platformColors[index % platformColors.length],
  }));

  // Status distribution
  const statusData = processedData.ayrshareHistory.reduce((acc: Record<string, number>, post: AyrshareHistoryItem) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  // Posts over time (last 7 days)
  const timeData = processedData.ayrshareHistory
    .reduce((acc: Record<string, number>, post: AyrshareHistoryItem) => {
      const date = new Date(post.created).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const timeChartData = Object.entries(timeData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      posts: count,
    }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformIcon = (platform: string) => {
    const IconComponent = platformIcons[platform.toLowerCase()];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  if (isLoadingHistory || isLoadingAnalytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading analytics data...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your social media performance across platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchHistory()}
            disabled={isLoadingHistory}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingHistory ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsSummary?.totalPosts || processedData.ayrshareHistory.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {processedData.localHistory.length} local, {processedData.ayrshareHistory.length} synced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsSummary?.avgEngagement || "0.0"}%
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
              {analyticsSummary?.totalReach?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              People reached
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsSummary?.avgClickRate || "0.0"}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {platformChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={platformChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No platform data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {timeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No time series data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Post Status Overview */}
      {statusChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Post Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {processedData.ayrshareHistory.length > 0 ? (
            <div className="space-y-4">
              {processedData.ayrshareHistory.slice(0, 5).map((post: AyrshareHistoryItem) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{post.post}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(post.created)}
                      </p>
                    </div>
                    <Badge variant={post.status === 'success' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.platforms.map((platform) => (
                      <div key={platform} className="flex items-center gap-1">
                        {getPlatformIcon(platform)}
                        <span className="text-xs capitalize">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No posts found. Create your first post to see analytics data here.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}