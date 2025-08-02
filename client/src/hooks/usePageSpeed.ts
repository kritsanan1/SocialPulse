
import { useState, useEffect } from 'react';

interface PageSpeedData {
  performanceScore: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  loading: boolean;
  error: string | null;
}

const PAGESPEED_API_KEY = process.env.VITE_PAGESPEED_API_KEY;

export function usePageSpeed(url?: string) {
  const [data, setData] = useState<PageSpeedData>({
    performanceScore: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    loading: false,
    error: null,
  });

  const analyzeUrl = async (targetUrl: string) => {
    if (!PAGESPEED_API_KEY) {
      setData(prev => ({ ...prev, error: 'PageSpeed API key not configured' }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${PAGESPEED_API_KEY}&category=performance`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`PageSpeed API error: ${response.status}`);
      }

      const result = await response.json();
      const lighthouse = result.lighthouseResult;
      const audits = lighthouse.audits;

      setData({
        performanceScore: Math.round(lighthouse.categories.performance.score * 100),
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        fid: audits['max-potential-fid']?.numericValue || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to analyze page speed',
      }));
    }
  };

  useEffect(() => {
    if (url) {
      analyzeUrl(url);
    }
  }, [url]);

  return { ...data, analyzeUrl };
}
