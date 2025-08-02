
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerSentimentAnalysisRoutes(app: Express) {
  
  // Get overall sentiment analysis
  app.get("/api/sentiment/overview", isAuthenticated, async (req: any, res) => {
    try {
      const { timeframe, platforms } = req.query;
      
      const sentimentData = {
        overall: {
          score: 0.72, // Scale -1 to 1
          trend: '+5%',
          classification: 'Positive',
          confidence: 0.89
        },
        breakdown: {
          positive: 65,
          neutral: 25, 
          negative: 10
        },
        platformBreakdown: {
          twitter: { positive: 60, neutral: 30, negative: 10, score: 0.68 },
          linkedin: { positive: 75, neutral: 20, negative: 5, score: 0.81 },
          facebook: { positive: 62, neutral: 28, negative: 10, score: 0.70 },
          instagram: { positive: 70, neutral: 22, negative: 8, score: 0.76 }
        },
        trending: {
          topics: [
            { keyword: 'customer service', sentiment: 0.85, mentions: 142 },
            { keyword: 'product quality', sentiment: 0.78, mentions: 98 },
            { keyword: 'pricing', sentiment: 0.45, mentions: 67 },
            { keyword: 'user experience', sentiment: 0.82, mentions: 156 }
          ]
        },
        alerts: [
          {
            id: '1',
            type: 'negative_spike',
            message: 'Negative mentions increased by 15% in the last 24h',
            severity: 'medium',
            platform: 'twitter',
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      res.json(sentimentData);
    } catch (error) {
      console.error("Error fetching sentiment overview:", error);
      res.status(500).json({ message: "Failed to fetch sentiment analysis" });
    }
  });

  // Get detailed sentiment analysis for specific content
  app.get("/api/sentiment/posts", isAuthenticated, async (req: any, res) => {
    try {
      const { postId, platform } = req.query;
      
      const posts = [
        {
          id: '1',
          content: 'Just launched our new feature! Excited to hear your thoughts.',
          platform: 'twitter',
          publishedAt: '2024-01-15T10:00:00Z',
          sentiment: {
            overall: 0.75,
            confidence: 0.92,
            breakdown: { positive: 80, neutral: 15, negative: 5 }
          },
          comments: [
            {
              id: 'c1',
              text: 'Love the new feature! Game changer.',
              sentiment: { score: 0.89, classification: 'positive' },
              platform: 'twitter'
            },
            {
              id: 'c2', 
              text: 'Looks good but pricing could be better',
              sentiment: { score: 0.2, classification: 'neutral' },
              platform: 'twitter'
            },
            {
              id: 'c3',
              text: 'Not working for me, disappointed',
              sentiment: { score: -0.65, classification: 'negative' },
              platform: 'twitter'
            }
          ]
        }
      ];
      
      const filteredPosts = postId ? posts.filter(p => p.id === postId) : posts;
      
      res.json({
        posts: filteredPosts,
        summary: {
          totalAnalyzed: filteredPosts.length,
          averageSentiment: 0.72,
          mostPositive: filteredPosts[0],
          needsAttention: filteredPosts.filter(p => p.sentiment.overall < 0.3)
        }
      });
    } catch (error) {
      console.error("Error fetching post sentiment:", error);
      res.status(500).json({ message: "Failed to fetch post sentiment analysis" });
    }
  });

  // Get sentiment trends over time
  app.get("/api/sentiment/trends", isAuthenticated, async (req: any, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      // Generate mock trend data
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const trends = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        trends.push({
          date: date.toISOString().split('T')[0],
          positive: Math.random() * 30 + 50, // 50-80%
          neutral: Math.random() * 20 + 15,  // 15-35%
          negative: Math.random() * 15 + 5,  // 5-20%
          score: (Math.random() * 0.6 + 0.4), // 0.4-1.0
          volume: Math.random() * 500 + 100
        });
      }
      
      res.json({
        trends,
        insights: [
          "Sentiment improved by 12% this week",
          "Monday shows consistently lower sentiment",
          "Product-related posts have higher positive sentiment",
          "Customer service mentions need attention"
        ]
      });
    } catch (error) {
      console.error("Error fetching sentiment trends:", error);
      res.status(500).json({ message: "Failed to fetch sentiment trends" });
    }
  });

  // Analyze new content before posting
  app.post("/api/sentiment/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const { content, platform } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Mock sentiment analysis
      const analysis = {
        content,
        sentiment: {
          score: Math.random() * 2 - 1, // -1 to 1
          confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
          classification: Math.random() > 0.7 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative'
        },
        emotions: {
          joy: Math.random() * 0.3,
          anger: Math.random() * 0.1,
          fear: Math.random() * 0.05,
          sadness: Math.random() * 0.1,
          surprise: Math.random() * 0.2,
          disgust: Math.random() * 0.05
        },
        keywords: ['product', 'feature', 'excited', 'thoughts'],
        suggestions: [],
        riskLevel: 'low'
      };

      // Add suggestions based on sentiment
      if (analysis.sentiment.score < 0.3) {
        analysis.suggestions.push("Consider adding more positive language");
        analysis.suggestions.push("Include a call-to-action to engage users");
        analysis.riskLevel = 'medium';
      }
      
      if (analysis.sentiment.score < 0) {
        analysis.suggestions.push("This content may generate negative responses");
        analysis.riskLevel = 'high';
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing content sentiment:", error);
      res.status(500).json({ message: "Failed to analyze content sentiment" });
    }
  });

  // Get sentiment alerts and notifications
  app.get("/api/sentiment/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const alerts = [
        {
          id: '1',
          type: 'negative_spike',
          title: 'Negative Sentiment Spike Detected',
          message: 'Negative mentions increased by 25% in the last 4 hours',
          severity: 'high',
          platform: 'twitter',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionRequired: true,
          suggestedActions: [
            'Review recent posts for potential issues',
            'Monitor customer service channels',
            'Prepare response strategy'
          ]
        },
        {
          id: '2',
          type: 'positive_trend',
          title: 'Positive Sentiment Trending',
          message: 'Positive mentions up 18% this week',
          severity: 'low',
          platform: 'linkedin',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          actionRequired: false,
          suggestedActions: [
            'Amplify successful content',
            'Engage with positive commenters'
          ]
        }
      ];
      
      res.json({ alerts });
    } catch (error) {
      console.error("Error fetching sentiment alerts:", error);
      res.status(500).json({ message: "Failed to fetch sentiment alerts" });
    }
  });
}
