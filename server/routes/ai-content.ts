
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerAIContentRoutes(app: Express) {
  
  // Generate AI content
  app.post("/api/ai/generate-content", isAuthenticated, async (req: any, res) => {
    try {
      const { topic, tone, contentLength, platforms } = req.body;
      
      if (!topic || !platforms || platforms.length === 0) {
        return res.status(400).json({ message: "Topic and platforms are required" });
      }

      // Mock AI content generation for now
      // In production, integrate with OpenAI, Anthropic, or similar API
      const generatedContent = platforms.map((platform: string) => {
        const platformLimits: Record<string, number> = {
          twitter: 280,
          linkedin: 3000,
          facebook: 2000,
          instagram: 2200
        };

        const limit = platformLimits[platform] || 280;
        const content = generateMockContent(topic, tone, contentLength, platform, limit);
        
        return {
          platform,
          content,
          characterCount: content.length
        };
      });

      const hashtags = generateHashtags(topic);

      res.json({
        content: generatedContent,
        hashtags,
        usage: {
          tokensUsed: topic.length * platforms.length * 2, // Mock usage
          remainingCredits: 1000 // Mock remaining credits
        }
      });

    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Get trending topics
  app.get("/api/ai/trending-topics", isAuthenticated, async (req: any, res) => {
    try {
      // Mock trending topics - in production, integrate with social media APIs
      const trendingTopics = [
        "AI Innovation",
        "Sustainable Technology",
        "Remote Work",
        "Digital Marketing",
        "Climate Change",
        "Cryptocurrency",
        "Mental Health",
        "Productivity Tips",
        "Small Business",
        "Social Media Strategy"
      ];

      res.json({
        topics: trendingTopics,
        lastUpdated: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  // Generate content variations
  app.post("/api/ai/generate-variations", isAuthenticated, async (req: any, res) => {
    try {
      const { originalContent, platform, variationType } = req.body;
      
      if (!originalContent) {
        return res.status(400).json({ message: "Original content is required" });
      }

      const variations = generateContentVariations(originalContent, platform, variationType);

      res.json({
        variations,
        originalContent
      });

    } catch (error) {
      console.error("Error generating content variations:", error);
      res.status(500).json({ message: "Failed to generate variations" });
    }
  });

  // Generate AI images
  app.post("/api/ai/generate-image", isAuthenticated, async (req: any, res) => {
    try {
      const { prompt, style, dimensions } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Mock image generation - in production, integrate with DALL-E, Midjourney, or Stable Diffusion
      const mockImages = [
        {
          url: `https://picsum.photos/400/300?random=${Date.now()}`,
          prompt: prompt,
          style: style,
          dimensions: dimensions
        },
        {
          url: `https://picsum.photos/400/300?random=${Date.now() + 1}`,
          prompt: prompt,
          style: style,
          dimensions: dimensions
        }
      ];

      res.json({
        images: mockImages,
        usage: {
          creditsUsed: 2,
          remainingCredits: 48
        }
      });

    } catch (error) {
      console.error("Error generating images:", error);
      res.status(500).json({ message: "Failed to generate images" });
    }
  });

  // Enhance images
  app.post("/api/ai/enhance-image", isAuthenticated, async (req: any, res) => {
    try {
      const { imageUrl, enhancementType } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      // Mock enhancement - in production, integrate with image enhancement APIs
      const enhancedImage = {
        original: imageUrl,
        enhanced: `https://picsum.photos/800/600?random=${Date.now()}`,
        enhancementType: enhancementType,
        processingTime: "3.2s"
      };

      res.json({
        result: enhancedImage,
        usage: {
          creditsUsed: 1,
          remainingCredits: 47
        }
      });

    } catch (error) {
      console.error("Error enhancing image:", error);
      res.status(500).json({ message: "Failed to enhance image" });
    }
  });
}

function generateMockContent(topic: string, tone: string, length: string, platform: string, limit: number): string {
  const toneTemplates: Record<string, string[]> = {
    professional: [
      "Exploring the latest developments in {topic}. Key insights show...",
      "Industry analysis reveals {topic} is transforming how we...",
      "Professional perspective on {topic}: What this means for businesses..."
    ],
    casual: [
      "Just thinking about {topic} and wow, it's pretty amazing how...",
      "Quick thoughts on {topic} - anyone else finding this as interesting as I am?",
      "Casual chat about {topic}: here's what I've been noticing lately..."
    ],
    humorous: [
      "So, {topic} walked into a bar... Just kidding! But seriously,",
      "Plot twist: {topic} is actually way more fun than you'd expect!",
      "Breaking: Local person discovers {topic} isn't as boring as previously thought"
    ],
    inspirational: [
      "Every day, {topic} reminds us that we can achieve more than we imagine.",
      "The power of {topic} lies not in what it is, but in what it enables us to become.",
      "When we embrace {topic}, we open doors to possibilities we never knew existed."
    ]
  };

  const templates = toneTemplates[tone] || toneTemplates.professional;
  const template = templates[Math.floor(Math.random() * templates.length)];
  let content = template.replace('{topic}', topic);

  // Adjust length based on platform and requirements
  if (length === 'short') {
    content = content.substring(0, Math.min(limit * 0.4, content.length));
  } else if (length === 'long' && platform !== 'twitter') {
    content += " This represents a significant shift in how we approach innovation and growth. The implications extend far beyond what we initially anticipated, opening new avenues for exploration and development.";
  }

  // Ensure content doesn't exceed platform limits
  if (content.length > limit) {
    content = content.substring(0, limit - 3) + "...";
  }

  return content;
}

function generateHashtags(topic: string): string[] {
  const commonHashtags = ["#innovation", "#growth", "#business", "#technology", "#success"];
  const topicWords = topic.toLowerCase().split(' ');
  const topicHashtags = topicWords.map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`);
  
  return [...topicHashtags.slice(0, 3), ...commonHashtags.slice(0, 5)];
}

function generateContentVariations(original: string, platform: string, variationType: string): string[] {
  const variations = [];
  
  if (variationType === 'tone') {
    variations.push(
      original.replace(/\./g, '!'), // More enthusiastic
      original.toLowerCase(), // Casual
      `Professional take: ${original}` // Professional
    );
  } else if (variationType === 'length') {
    variations.push(
      original.split('.')[0] + '.', // Shorter
      `${original} Let me know your thoughts!`, // Longer
      original.split(' ').slice(0, 10).join(' ') + '...' // Truncated
    );
  }
  
  return variations.filter(v => v && v.length > 0);
}
