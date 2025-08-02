import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Heart, TrendingUp, Settings } from "lucide-react";
import { useState } from "react";

interface AnalyticsSummary {
  totalPosts: number;
  avgEngagement: string;
  totalReach: number;
  avgClickRate: string;
}

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("30d");

  const { data: summary, isLoading } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
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
          <CardTitle>Analytics Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Total Posts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary?.totalPosts || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-green-600 text-xs font-medium">+12%</span>
              <span className="text-blue-700 text-xs ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Engagement</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary?.avgEngagement ? parseFloat(summary.avgEngagement).toFixed(1) : "0.0"}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-green-600 text-xs font-medium">+8%</span>
              <span className="text-green-700 text-xs ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">Total Reach</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(summary?.totalReach || 0)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-red-600 text-xs font-medium">-3%</span>
              <span className="text-purple-700 text-xs ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900">Click Rate</p>
                <p className="text-2xl font-bold text-amber-600">
                  {summary?.avgClickRate ? parseFloat(summary.avgClickRate).toFixed(1) : "0.0"}%
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-green-600 text-xs font-medium">+15%</span>
              <span className="text-amber-700 text-xs ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">Analytics chart will be displayed here</p>
            <p className="text-xs text-gray-400">Integration with Chart.js coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
