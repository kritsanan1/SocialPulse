
import { Express } from 'express';

export function setupPerformanceRoutes(app: Express) {
  // Server-side performance monitoring
  app.get('/api/performance/metrics', async (req, res) => {
    try {
      const metrics = {
        serverStartTime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        timestamp: new Date().toISOString(),
      };

      res.json(metrics);
    } catch (error) {
      console.error('Performance metrics error:', error);
      res.status(500).json({ message: 'Failed to get performance metrics' });
    }
  });

  // Endpoint to receive client-side performance metrics
  app.post('/api/performance/report', async (req, res) => {
    try {
      const { url, metrics } = req.body;
      
      // Here you could store the metrics in a database for analysis
      console.log('Performance report for', url, ':', metrics);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Performance report error:', error);
      res.status(500).json({ message: 'Failed to save performance report' });
    }
  });
}
