import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, insertAnalyticsSchema, insertTeamSchema, insertAiSuggestionSchema } from "@shared/schema";
import { ayrshareClient, AyrshareClient } from "./ayrshare";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Post routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse(req.body);

      // Validate schedule date is in the future
      const scheduleDate = new Date(postData.scheduleDate);
      if (scheduleDate <= new Date()) {
        return res.status(400).json({ message: "Schedule date must be in the future" });
      }

      const post = await storage.createPost({ ...postData, userId });

      // Track usage
      await storage.incrementUsage(userId, 'posts');

      // Here you would integrate with Ayrshare API
      // For now, we'll simulate the API call
      try {
        // Simulate Ayrshare API call
        console.log("Scheduling post with Ayrshare:", post);
        // await ayrshareClient.post(post);

        await storage.updatePostStatus(post.id, "scheduled");
      } catch (ayrshareError) {
        console.error("Ayrshare API error:", ayrshareError);
        await storage.updatePostStatus(post.id, "failed");
      }

      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getUserPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const summary = await storage.getUserAnalyticsSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  app.post('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(analyticsData);
      res.json(analytics);
    } catch (error) {
      console.error("Error creating analytics:", error);
      res.status(500).json({ message: "Failed to create analytics" });
    }
  });

  // AI Suggestions routes
  app.get('/api/ai-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const suggestions = await storage.getUserAiSuggestions(userId);
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      res.status(500).json({ message: "Failed to fetch AI suggestions" });
    }
  });

  app.post('/api/ai-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const suggestionData = insertAiSuggestionSchema.parse(req.body);

      // Generate AI suggestions based on content and historical data
      const suggestions = await generateAISuggestions(userId, suggestionData.suggestionContent);

      const createdSuggestions = [];
      for (const suggestion of suggestions) {
        const created = await storage.createAiSuggestion({
          ...suggestion,
          userId,
        });
        createdSuggestions.push(created);
      }

      res.json(createdSuggestions);
    } catch (error) {
      console.error("Error creating AI suggestions:", error);
      res.status(500).json({ message: "Failed to create AI suggestions" });
    }
  });

  app.patch('/api/ai-suggestions/:id/apply', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markSuggestionApplied(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error applying AI suggestion:", error);
      res.status(500).json({ message: "Failed to apply AI suggestion" });
    }
  });

  // Team routes
  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeamMember({ ...teamData, userId });

      // Track usage
      await storage.incrementUsage(userId, 'teamMembers');

      res.json(team);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getUserTeamMembers(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Ayrshare API Routes

  // POST /api/ayrshare/post - Send post to Ayrshare
  app.post('/api/ayrshare/post', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Validate required fields
      const { post, platforms, mediaUrls, scheduleDate, profileKey } = req.body;

      if (!post || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ 
          message: "Post content and platforms array are required" 
        });
      }

      // Validate platforms
      if (!AyrshareClient.validatePlatforms(platforms)) {
        return res.status(400).json({ 
          message: "Invalid platform(s). Supported platforms: twitter, facebook, instagram, linkedin, tiktok, pinterest, snapchat, youtube, reddit, telegram, threads, bluesky, google" 
        });
      }

      // Validate media URLs if provided
      if (mediaUrls && Array.isArray(mediaUrls) && mediaUrls.length > 0) {
        if (!AyrshareClient.validateMediaUrls(mediaUrls)) {
          return res.status(400).json({ 
            message: "All media URLs must use HTTPS protocol" 
          });
        }
      }

      // Validate schedule date if provided
      if (scheduleDate && !AyrshareClient.validateScheduleDate(scheduleDate)) {
        return res.status(400).json({ 
          message: "Schedule date must be in the future" 
        });
      }

      // Check if Ayrshare API key is configured
      if (!process.env.AYRSHARE_API_KEY) {
        return res.status(500).json({ 
          message: "Ayrshare API key not configured. Please add AYRSHARE_API_KEY to environment variables." 
        });
      }

      // Prepare Ayrshare request
      const ayrshareData = {
        post,
        platforms,
        ...(mediaUrls && mediaUrls.length > 0 && { mediaUrls }),
        ...(scheduleDate && { scheduleDate }),
        ...(profileKey && { profileKey })
      };

      // Send to Ayrshare
      const ayrshareResponse = await ayrshareClient.post(ayrshareData);

      // Save post to database
      const postData = {
        content: post,
        platforms,
        mediaUrl: mediaUrls?.[0] || null,
        scheduleDate: new Date(scheduleDate || new Date()),
        profileKey: profileKey || null,
        userId,
        status: ayrshareResponse.status === 'success' ? 'scheduled' : 'failed'
      };

      const savedPost = await storage.createPost(postData);

      // Save post history
      await storage.createPostHistory({
        postId: savedPost.id,
        status: ayrshareResponse.status || 'unknown',
        response: ayrshareResponse,
      });

      res.json({
        success: true,
        post: savedPost,
        ayrshareResponse
      });

    } catch (error: any) {
      console.error("Ayrshare post error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to send post to Ayrshare" 
      });
    }
  });

  // GET /api/ayrshare/history - Get post history from Ayrshare
  app.get('/api/ayrshare/history', isAuthenticated, async (req: any, res) => {
    try {
      const { profileKey } = req.query;

      // Check if Ayrshare API key is configured
      if (!process.env.AYRSHARE_API_KEY) {
        return res.status(500).json({ 
          message: "Ayrshare API key not configured. Please add AYRSHARE_API_KEY to environment variables." 
        });
      }

      // Get history from Ayrshare
      const ayrshareHistory = await ayrshareClient.getHistory(profileKey);

      // Also get local post history for comparison
      const userId = req.user.claims.sub;
      const localPosts = await storage.getUserPosts(userId);

      res.json({
        success: true,
        ayrshareHistory: ayrshareHistory.history || [],
        localHistory: localPosts
      });

    } catch (error: any) {
      console.error("Ayrshare history error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to retrieve post history from Ayrshare" 
      });
    }
  });

  // POST /api/ayrshare/upload - Upload media to Ayrshare
  app.post('/api/ayrshare/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded. Please select an image or video file." 
        });
      }

      // Check if Ayrshare API key is configured
      if (!process.env.AYRSHARE_API_KEY) {
        return res.status(500).json({ 
          message: "Ayrshare API key not configured. Please add AYRSHARE_API_KEY to environment variables." 
        });
      }

      // Validate file size (additional check)
      if (req.file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ 
          message: "File too large. Maximum size is 50MB." 
        });
      }

      // Upload to Ayrshare
      const uploadResponse = await ayrshareClient.uploadMedia(
        req.file.buffer, 
        req.file.originalname
      );

      if (uploadResponse.status === 'success' && uploadResponse.url) {
        res.json({
          success: true,
          url: uploadResponse.url,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        });
      } else {
        res.status(500).json({ 
          message: uploadResponse.error || "Failed to upload media to Ayrshare" 
        });
      }

    } catch (error: any) {
      console.error("Ayrshare upload error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to upload media to Ayrshare" 
      });
    }
  });

  const httpServer = createServer(app);
  // Register feature routes
  try {
    const { registerAdvancedFeatures } = require("./routes/advanced-features");
    registerAdvancedFeatures(app);
  } catch (error) {
    console.log("Advanced features not available");
  }

  // Register Stripe routes
  try {
    const { registerStripeRoutes } = require("./routes/stripe");
    registerStripeRoutes(app);
  } catch (error) {
    console.log("Stripe features not available");
  }

  // Register AI Content routes
  try {
    const { registerAIContentRoutes } = require("./routes/ai-content");
    registerAIContentRoutes(app);
  } catch (error) {
    console.log("AI Content features not available");
  }

  // Schedule cleanup endpoint
  app.get("/api/posts/scheduled", isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getPostsByUser(req.user?.claims?.sub);
      const scheduledPosts = posts.filter(post => 
        post.status === 'scheduled' && 
        post.scheduledDate && 
        new Date(post.scheduledDate) > new Date()
      );
      res.json(scheduledPosts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  return httpServer;
}

// AI Suggestions generator function
async function generateAISuggestions(userId: string, content: string): Promise<Array<{
  suggestionType: string;
  suggestionContent: string;
}>> {
  // This would integrate with an AI service like OpenAI or similar
  // For now, providing rule-based suggestions
  const suggestions = [];

  // Content optimization suggestions
  if (content.length > 200) {
    suggestions.push({
      suggestionType: "content",
      suggestionContent: "Consider shortening your post for better engagement. Posts under 200 characters typically perform better."
    });
  }

  if (!content.includes("#")) {
    suggestions.push({
      suggestionType: "hashtags",
      suggestionContent: "Add relevant hashtags to increase discoverability. Consider #TechTrends #Innovation #Business"
    });
  }

  // Timing suggestions
  const now = new Date();
  const hour = now.getHours();
  if (hour < 9 || hour > 17) {
    suggestions.push({
      suggestionType: "timing",
      suggestionContent: "Consider scheduling during peak hours (9 AM - 5 PM) for better engagement rates."
    });
  }

  // Engagement suggestions
  if (!content.includes("?")) {
    suggestions.push({
      suggestionType: "engagement",
      suggestionContent: "Add a question to encourage comments and boost engagement. Example: 'What do you think about this?'"
    });
  }

  return suggestions;
}
import { registerAIContentRoutes } from "./routes/ai-content.js";
import { registerAdvancedFeatures } from "./routes/advanced-features.js";
import { registerStripeRoutes } from "./routes/stripe.js";
import { registerContentRecyclingRoutes } from "./routes/content-recycling.js";
import { registerSentimentAnalysisRoutes } from "./routes/sentiment-analysis.js";
import { registerCompetitorIntelligenceRoutes } from "./routes/competitor-intelligence.js";
import { registerAutoPilotRoutes } from "./routes/autopilot.js";
import { registerAdvancedAnalyticsRoutes } from "./routes/advanced-analytics.js";
// Register feature routes
registerAIContentRoutes(app);
registerAdvancedFeatures(app);
registerStripeRoutes(app);
registerContentRecyclingRoutes(app);
registerSentimentAnalysisRoutes(app);
registerCompetitorIntelligenceRoutes(app);
registerAutoPilotRoutes(app);
registerAdvancedAnalyticsRoutes(app);