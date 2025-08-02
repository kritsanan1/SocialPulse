import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, insertAnalyticsSchema, insertTeamSchema, insertAiSuggestionSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
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
