
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerAutoPilotRoutes(app: Express) {
  
  // Get auto-pilot settings
  app.get("/api/autopilot/settings", isAuthenticated, async (req: any, res) => {
    try {
      const settings = {
        enabled: false,
        contentCuration: {
          enabled: true,
          sources: ['industry_news', 'trending_topics', 'user_content'],
          filters: {
            minEngagementRate: 3.0,
            contentTypes: ['article', 'image', 'video'],
            excludeKeywords: ['competitor_names', 'controversial_topics']
          }
        },
        posting: {
          enabled: false,
          frequency: {
            daily: 2,
            weekly: 12,
            maxPerDay: 4
          },
          platforms: ['twitter', 'linkedin'],
          timingOptimization: true,
          approvalRequired: true
        },
        engagement: {
          enabled: true,
          autoLike: {
            enabled: true,
            criteria: 'mentions_brand OR from_followers',
            maxPerHour: 10
          },
          autoReply: {
            enabled: false,
            templates: [
              'Thank you for your feedback!',
              'We appreciate your support!',
              'Thanks for sharing this!'
            ],
            triggerKeywords: ['thanks', 'great', 'awesome']
          },
          autoFollow: {
            enabled: false,
            criteria: 'industry_influencers',
            maxPerDay: 5
          }
        },
        contentGuidelines: {
          brandVoice: 'professional_friendly',
          toneKeywords: ['innovative', 'helpful', 'reliable'],
          avoidKeywords: ['competitive', 'aggressive'],
          requireHashtags: true,
          maxHashtags: 5,
          includeCallToAction: true
        },
        safety: {
          humanReview: true,
          contentModeration: true,
          sentimentCheck: true,
          minSentimentScore: 0.5
        }
      };
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching autopilot settings:", error);
      res.status(500).json({ message: "Failed to fetch autopilot settings" });
    }
  });

  // Update auto-pilot settings
  app.put("/api/autopilot/settings", isAuthenticated, async (req: any, res) => {
    try {
      const updatedSettings = req.body;
      
      // Validate settings
      if (updatedSettings.posting?.frequency?.daily > 10) {
        return res.status(400).json({ message: "Daily posting limit cannot exceed 10" });
      }
      
      res.json({
        message: "Settings updated successfully",
        settings: updatedSettings,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating autopilot settings:", error);
      res.status(500).json({ message: "Failed to update autopilot settings" });
    }
  });

  // Get curated content suggestions
  app.get("/api/autopilot/curated-content", isAuthenticated, async (req: any, res) => {
    try {
      const { platform, contentType, limit = 10 } = req.query;
      
      const curatedContent = [
        {
          id: '1',
          type: 'article',
          title: '5 AI Trends Shaping the Future of Business',
          source: 'TechCrunch',
          url: 'https://techcrunch.com/ai-trends-business',
          summary: 'Artificial intelligence continues to revolutionize business operations...',
          suggestedCaption: 'Interesting read on AI trends that are reshaping business! What trends are you seeing in your industry? 🤖 #AI #BusinessTrends #Innovation',
          platforms: ['twitter', 'linkedin'],
          estimatedEngagement: 4.2,
          relevanceScore: 0.89,
          publishedAt: '2024-01-15T08:00:00Z',
          categories: ['technology', 'business', 'ai']
        },
        {
          id: '2',
          type: 'industry_insight',
          title: 'Remote Work Productivity Statistics 2024',
          source: 'Industry Research',
          content: '78% of companies report higher productivity with remote work arrangements.',
          suggestedCaption: '📊 New data shows remote work is here to stay! 78% of companies see productivity gains. How has remote work impacted your team? #RemoteWork #Productivity #WorkFromHome',
          platforms: ['linkedin', 'twitter'],
          estimatedEngagement: 5.1,
          relevanceScore: 0.85,
          categories: ['workplace', 'productivity', 'trends']
        },
        {
          id: '3',
          type: 'trending_topic',
          title: 'Sustainability in Tech',
          content: 'Green technology initiatives are becoming a competitive advantage.',
          suggestedCaption: 'Sustainability isn\'t just good for the planet - it\'s good for business 🌱 What green initiatives is your company implementing? #Sustainability #GreenTech #Innovation',
          platforms: ['linkedin', 'instagram'],
          estimatedEngagement: 3.8,
          relevanceScore: 0.76,
          categories: ['sustainability', 'technology', 'business']
        }
      ];
      
      let filtered = curatedContent;
      if (contentType) filtered = filtered.filter(c => c.type === contentType);
      
      res.json({
        content: filtered.slice(0, parseInt(limit as string)),
        totalAvailable: filtered.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching curated content:", error);
      res.status(500).json({ message: "Failed to fetch curated content" });
    }
  });

  // Get auto-pilot queue
  app.get("/api/autopilot/queue", isAuthenticated, async (req: any, res) => {
    try {
      const queue = [
        {
          id: '1',
          content: 'Excited to share insights from our latest industry report! 📊 #IndustryInsights #DataDriven',
          platforms: ['twitter', 'linkedin'],
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          source: 'curated',
          estimatedEngagement: 4.5,
          requiresApproval: true
        },
        {
          id: '2',
          content: 'The future of work is hybrid. Here\'s what our research shows... 🏢🏠 #FutureOfWork #HybridWork',
          platforms: ['linkedin'],
          scheduledFor: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: 'pending_approval',
          source: 'ai_generated',
          estimatedEngagement: 5.2,
          requiresApproval: true
        },
        {
          id: '3',
          content: 'Thank you to everyone who attended our webinar today! 🙏 #Webinar #ThankYou',
          platforms: ['twitter', 'linkedin'],
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'draft',
          source: 'template',
          estimatedEngagement: 3.8,
          requiresApproval: false
        }
      ];
      
      res.json({
        queue,
        summary: {
          total: queue.length,
          pending: queue.filter(q => q.status === 'pending_approval').length,
          scheduled: queue.filter(q => q.status === 'scheduled').length,
          drafts: queue.filter(q => q.status === 'draft').length
        }
      });
    } catch (error) {
      console.error("Error fetching autopilot queue:", error);
      res.status(500).json({ message: "Failed to fetch autopilot queue" });
    }
  });

  // Approve/reject queued content
  app.post("/api/autopilot/queue/:id/action", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { action, modifications } = req.body; // action: 'approve', 'reject', 'modify'
      
      if (!['approve', 'reject', 'modify'].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const result = {
        id,
        action,
        status: action === 'approve' ? 'scheduled' : action === 'reject' ? 'rejected' : 'modified',
        processedAt: new Date().toISOString(),
        modifications: modifications || null
      };
      
      res.json(result);
    } catch (error) {
      console.error("Error processing queue action:", error);
      res.status(500).json({ message: "Failed to process queue action" });
    }
  });

  // Get auto-pilot performance metrics
  app.get("/api/autopilot/performance", isAuthenticated, async (req: any, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      const performance = {
        timeframe,
        overview: {
          postsGenerated: 156,
          postsApproved: 142,
          postsPublished: 138,
          approvalRate: 91.0,
          avgEngagement: 4.3,
          timeSaved: '24 hours'
        },
        contentTypes: {
          'Curated Articles': { count: 45, avgEngagement: 4.8 },
          'AI Generated': { count: 38, avgEngagement: 4.1 },
          'Template Based': { count: 55, avgEngagement: 3.9 }
        },
        platforms: {
          'Twitter': { posts: 78, avgEngagement: 3.8 },
          'LinkedIn': { posts: 60, avgEngagement: 5.2 }
        },
        bestPerforming: [
          {
            content: 'AI trends shaping the future...',
            engagement: 8.9,
            platform: 'linkedin',
            type: 'curated'
          },
          {
            content: 'Remote work statistics reveal...',
            engagement: 7.2,
            platform: 'twitter',
            type: 'ai_generated'
          }
        ],
        insights: [
          'Curated content performs 15% better than AI-generated',
          'LinkedIn posts get 40% higher engagement',
          'Tuesday and Wednesday are optimal posting days',
          'Question-based posts drive 25% more comments'
        ]
      };
      
      res.json(performance);
    } catch (error) {
      console.error("Error fetching autopilot performance:", error);
      res.status(500).json({ message: "Failed to fetch autopilot performance" });
    }
  });

  // Generate content using auto-pilot
  app.post("/api/autopilot/generate", isAuthenticated, async (req: any, res) => {
    try {
      const { contentType, platform, topic, urgency = 'normal' } = req.body;
      
      // Mock AI content generation
      const templates = {
        'industry_insight': [
          'New research reveals {insight}. What are your thoughts? #Industry #Research',
          'Breaking: {insight} is changing how we think about {topic}. 🔄 #{topic}',
          '{insight} - this could be a game changer for {industry}! What do you think? 💭'
        ],
        'thought_leadership': [
          'After years in {industry}, here\'s what I\'ve learned about {topic}... 🧵',
          'Unpopular opinion: {opinion}. Here\'s why I think this matters... 💡',
          'The future of {topic} isn\'t what you think. Let me explain... 🔮'
        ],
        'company_update': [
          'Excited to share our progress on {project}! Here\'s what we\'ve accomplished: ✅',
          'Big news from our team! We\'re {update}. Can\'t wait to share more soon! 🎉',
          'Milestone reached! 🎯 Our {metric} just hit {number}. Thank you to our amazing community!'
        ]
      };

      const selectedTemplates = templates[contentType as keyof typeof templates] || templates.industry_insight;
      const template = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
      
      const generatedContent = {
        content: template.replace(/\{[^}]+\}/g, (match) => {
          const placeholder = match.slice(1, -1);
          const replacements: { [key: string]: string } = {
            insight: 'AI adoption in business is accelerating faster than expected',
            topic: topic || 'technology',
            industry: 'technology',
            opinion: 'remote work is more productive than office work',
            project: 'new AI platform',
            update: 'launching our biggest feature yet',
            metric: 'user satisfaction',
            number: '95%'
          };
          return replacements[placeholder] || placeholder;
        }),
        platform,
        estimatedEngagement: Math.random() * 3 + 3, // 3-6
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        hashtags: ['#Innovation', '#Technology', '#Business'],
        suggestedTiming: 'Tuesday 2-4 PM',
        requiresApproval: true
      };
      
      res.json(generatedContent);
    } catch (error) {
      console.error("Error generating autopilot content:", error);
      res.status(500).json({ message: "Failed to generate autopilot content" });
    }
  });
}
