
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePageSpeed } from '@/hooks/usePageSpeed';
import { Activity, Clock, Eye, MousePointer, Zap } from 'lucide-react';

interface WebVitals {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
}

export function PerformanceMonitor() {
  const [webVitals, setWebVitals] = useState<WebVitals>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    ttfb: 0,
  });

  const { performanceScore, fcp, lcp, cls, fid, loading, error, analyzeUrl } = usePageSpeed();

  useEffect(() => {
    // Measure real user metrics
    if ('web-vitals' in window) {
      // This would require importing web-vitals library
      // For now, we'll simulate the measurements
      const simulateMetrics = () => {
        setWebVitals({
          fcp: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          lcp: 0, // Would need proper LCP measurement
          cls: 0, // Would need proper CLS measurement
          fid: 0, // Would need proper FID measurement
          ttfb: performance.getEntriesByType('navigation')[0]?.responseStart || 0,
        });
      };

      setTimeout(simulateMetrics, 1000);
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>;
    if (score >= 50) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>;
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <CardDescription>
            Core Web Vitals and performance metrics for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">First Contentful Paint</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{Math.round(webVitals.fcp)}ms</div>
              {getScoreBadge(webVitals.fcp < 1800 ? 90 : webVitals.fcp < 3000 ? 50 : 0)}
            </div>

            <div className="p-3 sm:p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Largest Contentful Paint</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{Math.round(webVitals.lcp)}ms</div>
              {getScoreBadge(webVitals.lcp < 2500 ? 90 : webVitals.lcp < 4000 ? 50 : 0)}
            </div>

            <div className="p-3 sm:p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">First Input Delay</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{Math.round(webVitals.fid)}ms</div>
              {getScoreBadge(webVitals.fid < 100 ? 90 : webVitals.fid < 300 ? 50 : 0)}
            </div>

            <div className="p-3 sm:p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Cumulative Layout Shift</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{webVitals.cls.toFixed(3)}</div>
              {getScoreBadge(webVitals.cls < 0.1 ? 90 : webVitals.cls < 0.25 ? 50 : 0)}
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Time to First Byte</span>
              </div>
              <div className="text-2xl font-bold">{Math.round(webVitals.ttfb)}ms</div>
              {getScoreBadge(webVitals.ttfb < 800 ? 90 : webVitals.ttfb < 1800 ? 50 : 0)}
            </div>

            {performanceScore > 0 && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">PageSpeed Score</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}/100
                </div>
                {getScoreBadge(performanceScore)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => analyzeUrl(window.location.href)}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Analyze Current Page with PageSpeed Insights'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
