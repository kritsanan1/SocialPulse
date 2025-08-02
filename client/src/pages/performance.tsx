
import { PerformanceMonitor } from '@/components/performance-monitor';

export default function Performance() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Performance Monitoring</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Monitor your application's Core Web Vitals and performance metrics
        </p>
      </div>
      
      <PerformanceMonitor />
    </div>
  );
}
