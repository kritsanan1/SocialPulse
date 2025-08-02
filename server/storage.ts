import {
  users,
  posts,
  postHistory,
  analytics,
  teams,
  aiSuggestions,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type PostHistory,
  type Analytics,
  type InsertAnalytics,
  type Team,
  type InsertTeam,
  type AiSuggestion,
  type InsertAiSuggestion,
  subscriptions,
  billingHistory,
  usageTracking,
  type InsertSubscription,
  type InsertBillingHistory,
  type InsertUsageTracking,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Post operations
  createPost(post: InsertPost & { userId: string }): Promise<Post>;
  getUserPosts(userId: string): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  updatePostStatus(id: string, status: string): Promise<void>;

  // Post history operations
  createPostHistory(history: { postId: string; status: string; response: any }): Promise<PostHistory>;

  // Analytics operations
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getPostAnalytics(postId: string): Promise<Analytics[]>;
  getUserAnalyticsSummary(userId: string): Promise<{
    totalPosts: number;
    avgEngagement: string;
    totalReach: number;
    avgClickRate: string;
  }>;

  // Team operations
  createTeamMember(team: InsertTeam): Promise<Team>;
  getUserTeamMembers(userId: string): Promise<Team[]>;

  // AI Suggestions operations
  createAiSuggestion(suggestion: InsertAiSuggestion & { userId: string }): Promise<AiSuggestion>;
  getUserAiSuggestions(userId: string): Promise<AiSuggestion[]>;
  markSuggestionApplied(id: string): Promise<void>;

    // Subscription methods
    createSubscription(subscription: InsertSubscription): Promise<InsertSubscription>;
    getSubscriptionByUserId(userId: string): Promise<InsertSubscription | undefined>;
    getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<InsertSubscription | undefined>;
    updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<InsertSubscription | undefined>;
    updateSubscriptionByStripeId(stripeSubscriptionId: string, updates: Partial<InsertSubscription>): Promise<InsertSubscription | undefined>;

    // Billing history methods
    createBillingRecord(billing: InsertBillingHistory): Promise<InsertBillingHistory>;
    getBillingHistory(userId: string): Promise<InsertBillingHistory[]>;

    // Usage tracking methods
    getOrCreateUsageTracking(userId: string, month: string): Promise<InsertUsageTracking>;
    updateUsageTracking(userId: string, month: string, updates: Partial<InsertUsageTracking>): Promise<InsertUsageTracking | undefined>;
    incrementUsage(userId: string, type: 'posts' | 'accounts' | 'teamMembers' | 'aiGenerations', amount?: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Post operations
  async createPost(postData: InsertPost & { userId: string }): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(postData)
      .returning();
    return post;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async updatePostStatus(id: string, status: string): Promise<void> {
    await db
      .update(posts)
      .set({ status })
      .where(eq(posts.id, id));
  }

  // Analytics operations
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analytic] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return analytic;
  }

  async getPostAnalytics(postId: string): Promise<Analytics[]> {
    return db
      .select()
      .from(analytics)
      .where(eq(analytics.postId, postId));
  }

  async getUserAnalyticsSummary(userId: string): Promise<{
    totalPosts: number;
    avgEngagement: string;
    totalReach: number;
    avgClickRate: string;
  }> {
    const userPosts = await db
      .select()
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.status, "published")));

    if (userPosts.length === 0) {
      return {
        totalPosts: 0,
        avgEngagement: "0.0",
        totalReach: 0,
        avgClickRate: "0.0",
      };
    }

    const postIds = userPosts.map(p => p.id);

    const analyticsData = await db
      .select({
        avgEngagement: sql<string>`AVG(${analytics.engagementRate})::text`,
        totalReach: sql<number>`SUM(${analytics.reach})::int`,
        avgClicks: sql<string>`AVG(${analytics.clicks})::text`,
        avgImpressions: sql<string>`AVG(${analytics.impressions})::text`,
      })
      .from(analytics)
      .where(sql`${analytics.postId} = ANY(${postIds})`);

    const summary = analyticsData[0];
    const clickRate = summary?.avgClicks && summary?.avgImpressions 
      ? ((parseFloat(summary.avgClicks) / parseFloat(summary.avgImpressions)) * 100).toFixed(1)
      : "0.0";

    return {
      totalPosts: userPosts.length,
      avgEngagement: summary?.avgEngagement || "0.0",
      totalReach: summary?.totalReach || 0,
      avgClickRate: clickRate,
    };
  }

  // Team operations
  async createTeamMember(teamData: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(teamData)
      .returning();
    return team;
  }

  async getUserTeamMembers(userId: string): Promise<Team[]> {
    return db
      .select()
      .from(teams)
      .where(eq(teams.userId, userId));
  }

  // AI Suggestions operations
  async createAiSuggestion(suggestionData: InsertAiSuggestion & { userId: string }): Promise<AiSuggestion> {
    const [suggestion] = await db
      .insert(aiSuggestions)
      .values(suggestionData)
      .returning();
    return suggestion;
  }

  async getUserAiSuggestions(userId: string): Promise<AiSuggestion[]> {
    return db
      .select()
      .from(aiSuggestions)
      .where(and(eq(aiSuggestions.userId, userId), eq(aiSuggestions.applied, false)))
      .orderBy(desc(aiSuggestions.createdAt))
      .limit(5);
  }

  async markSuggestionApplied(id: string): Promise<void> {
    await db
      .update(aiSuggestions)
      .set({ applied: true })
      .where(eq(aiSuggestions.id, id));
  }

  // Post history operations
  async createPostHistory(historyData: { postId: string; status: string; response: any }): Promise<PostHistory> {
    const [history] = await db
      .insert(postHistory)
      .values(historyData)
      .returning();
    return history;
  }

  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<InsertSubscription> {
    const [created] = await db.insert(subscriptions).values(subscription).returning();
    return created;
  }

  async getSubscriptionByUserId(userId: string): Promise<InsertSubscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return subscription;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<InsertSubscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return subscription;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<InsertSubscription | undefined> {
    const [updated] = await db.update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return updated;
  }

  async updateSubscriptionByStripeId(stripeSubscriptionId: string, updates: Partial<InsertSubscription>): Promise<InsertSubscription | undefined> {
    const [updated] = await db.update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
    return updated;
  }

  // Billing history methods
  async createBillingRecord(billing: InsertBillingHistory): Promise<InsertBillingHistory> {
    const [created] = await db.insert(billingHistory).values(billing).returning();
    return created;
  }

  async getBillingHistory(userId: string): Promise<InsertBillingHistory[]> {
    return await db.select()
      .from(billingHistory)
      .where(eq(billingHistory.userId, userId))
      .orderBy(desc(billingHistory.createdAt));
  }

  // Usage tracking methods
  async getOrCreateUsageTracking(userId: string, month: string): Promise<InsertUsageTracking> {
    const [existing] = await db.select()
      .from(usageTracking)
      .where(and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.month, month)
      ));

    if (existing) {
      return existing;
    }

    const subscription = await this.getSubscriptionByUserId(userId);
    const [created] = await db.insert(usageTracking).values({
      userId,
      subscriptionId: subscription?.id || null,
      month,
    }).returning();
    return created;
  }

  async updateUsageTracking(userId: string, month: string, updates: Partial<InsertUsageTracking>): Promise<InsertUsageTracking | undefined> {
    const [updated] = await db.update(usageTracking)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.month, month)
      ))
      .returning();
    return updated;
  }

  async incrementUsage(userId: string, type: 'posts' | 'accounts' | 'teamMembers' | 'aiGenerations', amount: number = 1): Promise<void> {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const usage = await this.getOrCreateUsageTracking(userId, month);

    const updateField = {
      posts: 'postsCreated',
      accounts: 'accountsConnected',
      teamMembers: 'teamMembersAdded',
      aiGenerations: 'aiGenerationsUsed'
    }[type];

    const currentValue = usage[updateField] || 0;
    await this.updateUsageTracking(userId, month, {
      [updateField]: currentValue + amount
    });
  }
}

export const storage = new DatabaseStorage();