
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerCompetitorIntelligenceRoutes(app: Express) {
  
  // Get competitor overview
  app.get("/api/competitors/overview", isAuthenticated, async (req: any, res) => {
    try {
      const competitors = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          handle: '@techcorp',
          platforms: ['twitter', 'linkedin', 'facebook'],
          followers: { twitter: 15000, linkedin: 8500, facebook: 12000 },
          avgEngagement: 4.2,
          postFrequency: 12, // posts per week
          topContent: 'Product updates',
          sentiment: 0.68,
          growthRate: '+12%'
        },
        {
          id: '2', 
          name: 'InnovateLabs',
          handle: '@innovatelabs',
          platforms: ['twitter', 'linkedin', 'instagram'],
          followers: { twitter: 22000, linkedin: 15000, instagram: 18000 },
          avgEngagement: 5.1,
          postFrequency: 8,
          topContent: 'Industry insights',
          sentiment: 0.75,
          growthRate: '+8%'
        },
        {
          id: '3',
          name: 'Digital Dynamics',
          handle: '@digitaldynamics', 
          platforms: ['linkedin', 'facebook', 'instagram'],
          followers: { linkedin: 6500, facebook: 9000, instagram: 11000 },
          avgEngagement: 3.8,
          postFrequency: 15,
          topContent: 'Behind the scenes',
          sentiment: 0.61,
          growthRate: '+18%'
        }
      ];
      
      res.json({
        competitors,
        summary: {
          totalTracked: competitors.length,
          avgMarketEngagement: 4.37,
          topPerformer: competitors[1],
          fastestGrowing: competitors[2]
        }
      });
    } catch (error) {
      console.error("Error fetching competitor overview:", error);
      res.status(500).json({ message: "Failed to fetch competitor overview" });
    }
  });

  // Get detailed competitor analysis
  app.get("/api/competitors/:id/analysis", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { timeframe = '30d' } = req.query;
      
      const analysis = {
        competitor: {
          id,
          name: 'TechCorp Solutions',
          handle: '@techcorp'
        },
        timeframe,
        metrics: {
          posts: 45,
          avgEngagement: 4.2,
          topPost: {
            content: 'Excited to announce our AI breakthrough!',
            engagement: 245,
            platform: 'linkedin',
            date: '2024-01-10'
          },
          contentTypes: {
            'Product Updates': 35,
            'Industry News': 25,
            'Company Culture': 20,
            'Thought Leadership': 20
          },
          postingTimes: {
            'Monday': { '9AM': 3, '2PM': 2, '6PM': 1 },
            'Tuesday': { '9AM': 2, '2PM': 3, '6PM': 1 },
            'Wednesday': { '9AM': 4, '2PM': 2, '6PM': 0 }
          },
          hashtags: [
            { tag: '#AI', usage: 15, engagement: 4.5 },
            { tag: '#Innovation', usage: 12, engagement: 4.2 },
            { tag: '#TechNews', usage: 8, engagement: 3.8 }
          ]
        },
        insights: [
          'Posts about AI get 40% higher engagement',
          'LinkedIn performs best on Tuesday afternoons',
          'Product announcement posts drive most shares',
          'Audience prefers visual content over text-only'
        ],
        opportunities: [
          'They rarely post on weekends - opportunity for you',
          'Limited video content usage',
          'Underutilizing Instagram Stories',
          'No interactive content (polls, Q&A)'
        ]
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching competitor analysis:", error);
      res.status(500).json({ message: "Failed to fetch competitor analysis" });
    }
  });

  // Get competitor content feed
  app.get("/api/competitors/content-feed", isAuthenticated, async (req: any, res) => {
    try {
      const { platform, competitorId, limit = 20 } = req.query;
      
      const posts = [
        {
          id: '1',
          competitorId: '1',
          competitorName: 'TechCorp Solutions',
          content: 'Excited to announce our new AI-powered analytics dashboard! 🚀 #AI #Analytics',
          platform: 'twitter',
          publishedAt: '2024-01-15T14:30:00Z',
          metrics: { likes: 45, shares: 12, comments: 8 },
          engagement: 4.2,
          contentType: 'Product Update',
          mediaUrls: ['https://picsum.photos/400/300?random=1'],
          hashtags: ['#AI', '#Analytics']
        },
        {
          id: '2',
          competitorId: '2',
          competitorName: 'InnovateLabs',
          content: 'The future of work is remote-first. Here\'s what we learned after 2 years...',
          platform: 'linkedin',
          publishedAt: '2024-01-14T09:15:00Z',
          metrics: { likes: 120, shares: 35, comments: 22 },
          engagement: 5.8,
          contentType: 'Thought Leadership',
          mediaUrls: [],
          hashtags: ['#RemoteWork', '#FutureOfWork']
        },
        {
          id: '3',
          competitorId: '1',
          competitorName: 'TechCorp Solutions',
          content: 'Behind the scenes: Our development team working on the next big feature',
          platform: 'instagram',
          publishedAt: '2024-01-13T16:45:00Z',
          metrics: { likes: 89, shares: 15, comments: 12 },
          engagement: 3.9,
          contentType: 'Behind the Scenes',
          mediaUrls: ['https://picsum.photos/400/400?random=2'],
          hashtags: ['#BehindTheScenes', '#Development']
        }
      ];
      
      let filteredPosts = posts;
      if (platform) filteredPosts = posts.filter(p => p.platform === platform);
      if (competitorId) filteredPosts = posts.filter(p => p.competitorId === competitorId);
      
      res.json({
        posts: filteredPosts.slice(0, parseInt(limit as string)),
        totalCount: filteredPosts.length,
        filters: { platform, competitorId, limit }
      });
    } catch (error) {
      console.error("Error fetching competitor content feed:", error);
      res.status(500).json({ message: "Failed to fetch competitor content feed" });
    }
  });

  // Get trending topics in your industry
  app.get("/api/competitors/trending", isAuthenticated, async (req: any, res) => {
    try {
      const { industry = 'technology', timeframe = '7d' } = req.query;
      
      const trending = {
        topics: [
          {
            keyword: 'Artificial Intelligence',
            mentions: 245,
            growth: '+25%',
            sentiment: 0.72,
            topCompetitors: ['TechCorp Solutions', 'InnovateLabs'],
            opportunity: 'high'
          },
          {
            keyword: 'Remote Work',
            mentions: 189,
            growth: '+12%',
            sentiment: 0.68,
            topCompetitors: ['InnovateLabs', 'Digital Dynamics'],
            opportunity: 'medium'
          },
          {
            keyword: 'Cybersecurity',
            mentions: 156,
            growth: '+8%',
            sentiment: 0.55,
            topCompetitors: ['TechCorp Solutions'],
            opportunity: 'high'
          }
        ],
        hashtags: [
          { tag: '#AI', mentions: 312, growth: '+30%' },
          { tag: '#Innovation', mentions: 278, growth: '+15%' },
          { tag: '#TechTrends', mentions: 198, growth: '+22%' }
        ],
        insights: [
          'AI content gets 40% more engagement than average',
          'Video content about remote work is trending',
          'Cybersecurity topics have high potential but low competition'
        ]
      };
      
      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  // Add competitor to tracking
  app.post("/api/competitors", isAuthenticated, async (req: any, res) => {
    try {
      const { name, handles, platforms } = req.body;
      
      if (!name || !handles || !platforms) {
        return res.status(400).json({ message: "Name, handles, and platforms are required" });
      }

      const newCompetitor = {
        id: Date.now().toString(),
        name,
        handles,
        platforms,
        addedAt: new Date().toISOString(),
        status: 'active',
        trackingEnabled: true
      };
      
      res.json(newCompetitor);
    } catch (error) {
      console.error("Error adding competitor:", error);
      res.status(500).json({ message: "Failed to add competitor" });
    }
  });

  // Get market position analysis
  app.get("/api/competitors/market-position", isAuthenticated, async (req: any, res) => {
    try {
      const analysis = {
        yourPosition: {
          marketShare: 15,
          engagementRate: 4.5,
          followerGrowth: '+22%',
          contentVolume: 18 // posts per week
        },
        competitors: [
          { name: 'TechCorp Solutions', marketShare: 25, engagementRate: 4.2, followerGrowth: '+12%' },
          { name: 'InnovateLabs', marketShare: 20, engagementRate: 5.1, followerGrowth: '+8%' },
          { name: 'Digital Dynamics', marketShare: 18, engagementRate: 3.8, followerGrowth: '+18%' }
        ],
        strengths: [
          'Highest follower growth rate',
          'Strong engagement on video content',
          'Consistent posting schedule'
        ],
        weaknesses: [
          'Lower market share than top competitor',
          'Limited presence on Instagram',
          'Less thought leadership content'
        ],
        recommendations: [
          'Increase Instagram presence - competitors are gaining ground there',
          'Create more thought leadership content like InnovateLabs',
          'Leverage your high growth rate for partnerships'
        ]
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching market position:", error);
      res.status(500).json({ message: "Failed to fetch market position analysis" });
    }
  });
}
