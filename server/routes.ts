import express from "express";
import { Request, Response } from "express";
import { registerAIContentRoutes } from "./routes/ai-content";

export function registerRoutes(app: express.Application): express.Application {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // AI Content routes
  registerAIContentRoutes(app);

  // Posts and Scheduling routes
  app.get("/api/posts/scheduled", async (req: Request, res: Response) => {
    try {
      // Mock data - replace with actual database queries
      const posts = [
        {
          id: "1",
          content: "Exciting news about our latest product launch! 🚀",
          platforms: ["twitter", "linkedin"],
          scheduled_for: "2025-01-04T14:00:00Z",
          status: "scheduled",
          media_urls: [],
          hashtags: ["product", "launch", "innovation"],
          created_at: "2025-01-03T10:00:00Z"
        },
        {
          id: "2", 
          content: "Join us for our weekly team meeting to discuss Q1 goals",
          platforms: ["linkedin"],
          scheduled_for: "2025-01-05T09:00:00Z",
          status: "scheduled",
          media_urls: [],
          hashtags: ["team", "goals", "meeting"],
          created_at: "2025-01-03T11:00:00Z"
        }
      ];

      res.json({ success: true, posts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scheduled posts" });
    }
  });

  app.post("/api/posts/schedule", async (req: Request, res: Response) => {
    try {
      const { content, platforms, scheduled_for, hashtags, auto_post } = req.body;

      if (!content || !platforms || !scheduled_for) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Mock scheduling - replace with actual implementation
      const scheduledPost = {
        id: Math.random().toString(36).substring(7),
        content,
        platforms,
        scheduled_for,
        hashtags: hashtags || [],
        auto_post: auto_post !== false,
        status: "scheduled",
        created_at: new Date().toISOString()
      };

      res.json({ success: true, post: scheduledPost });
    } catch (error) {
      res.status(500).json({ error: "Failed to schedule post" });
    }
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Mock deletion - replace with actual database operation
      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Team Management routes
  app.get("/api/team/members", async (req: Request, res: Response) => {
    try {
      const members = [
        {
          id: "1",
          name: "John Doe",
          email: "john@company.com",
          role: "owner",
          status: "active",
          avatar_url: null,
          joined_at: "2024-01-01T00:00:00Z",
          last_active: "2025-01-03T15:30:00Z",
          permissions: ["all"]
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@company.com",
          role: "admin",
          status: "active",
          avatar_url: null,
          joined_at: "2024-02-15T00:00:00Z",
          last_active: "2025-01-03T12:45:00Z",
          permissions: ["manage_team", "manage_content", "view_analytics"]
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@company.com",
          role: "editor",
          status: "active",
          avatar_url: null,
          joined_at: "2024-06-01T00:00:00Z",
          last_active: "2025-01-02T18:20:00Z",
          permissions: ["manage_content", "view_analytics"]
        }
      ];

      res.json({ success: true, members });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/team/invites", async (req: Request, res: Response) => {
    try {
      const invites = [
        {
          id: "1",
          email: "newmember@company.com",
          role: "editor",
          invited_by: "John Doe",
          invited_at: "2025-01-02T10:00:00Z",
          expires_at: "2025-01-09T10:00:00Z",
          status: "pending"
        }
      ];

      res.json({ success: true, invites });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team invites" });
    }
  });

  app.post("/api/team/invite", async (req: Request, res: Response) => {
    try {
      const { email, role, message } = req.body;

      if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required" });
      }

      // Mock invite creation
      const invite = {
        id: Math.random().toString(36).substring(7),
        email,
        role,
        message: message || "",
        invited_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: "pending"
      };

      res.json({ success: true, invite });
    } catch (error) {
      res.status(500).json({ error: "Failed to send invitation" });
    }
  });

  app.put("/api/team/members/:id/role", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ error: "Role is required" });
      }

      res.json({ success: true, message: "Member role updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update member role" });
    }
  });

  app.delete("/api/team/members/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      res.json({ success: true, message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove member" });
    }
  });

  app.delete("/api/team/invites/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      res.json({ success: true, message: "Invitation cancelled" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel invitation" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", async (req: Request, res: Response) => {
    try {
      const overview = {
        total_posts: 156,
        total_engagement: 12450,
        follower_growth: 8.5,
        reach: 45200,
        impressions: 89300,
        clicks: 2340,
        shares: 890,
        comments: 567,
        platform_breakdown: {
          twitter: { posts: 45, engagement: 3200 },
          linkedin: { posts: 38, engagement: 4500 },
          instagram: { posts: 42, engagement: 3800 },
          facebook: { posts: 31, engagement: 950 }
        }
      };

      res.json({ success: true, data: overview });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics overview" });
    }
  });

  // Performance monitoring routes
  app.get("/api/performance/metrics", async (req: Request, res: Response) => {
    try {
      const metrics = {
        core_web_vitals: {
          lcp: 1.8,
          fid: 45,
          cls: 0.08
        },
        page_speed: {
          desktop: 94,
          mobile: 87
        },
        uptime: 99.9,
        response_time: 245,
        error_rate: 0.02
      };

      res.json({ success: true, metrics });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
  });

  // Billing routes  
  app.get("/api/billing/subscription", async (req: Request, res: Response) => {
    try {
      const subscription = {
        plan: "pro",
        status: "active",
        current_period_start: "2024-12-01T00:00:00Z",
        current_period_end: "2025-01-01T00:00:00Z",
        amount: 29.99,
        currency: "usd",
        next_billing_date: "2025-02-01T00:00:00Z"
      };

      res.json({ success: true, subscription });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription details" });
    }
  });

  return app;
}