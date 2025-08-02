
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

interface ContentRequest {
  topic: string;
  platforms: string[];
  tone: string;
  length: number;
  include_hashtags: boolean;
  include_emojis: boolean;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  tone: string;
  length: number;
  engagement_score: number;
}

const platformLimits = {
  twitter: 280,
  facebook: 2000,
  instagram: 2200,
  linkedin: 1300,
  tiktok: 150,
  pinterest: 500
};

const toneTemplates = {
  professional: {
    starters: ["Discover", "Learn", "Explore", "Understanding", "Professional"],
    endings: ["Share your thoughts.", "What's your experience?", "Let's discuss."]
  },
  casual: {
    starters: ["Hey", "So", "Just thinking", "Quick thought", "Honestly"],
    endings: ["What do you think?", "Anyone else?", "Thoughts?", "😊"]
  },
  humorous: {
    starters: ["You know what's funny?", "Plot twist:", "Breaking news:", "Fun fact:"],
    endings: ["😂", "Just saying!", "Am I right?", "Too relatable?"]
  },
  inspirational: {
    starters: ["Remember:", "Today's the day to", "You have the power to", "Believe that"],
    endings: ["You've got this! 💪", "Keep pushing forward!", "Make it happen!"]
  },
  educational: {
    starters: ["Did you know?", "Pro tip:", "Here's how to", "Learn something new:"],
    endings: ["Save this for later!", "Share to help others learn!", "Knowledge is power!"]
  },
  promotional: {
    starters: ["Exciting news!", "Don't miss out on", "Limited time:", "Introducing"],
    endings: ["Act now!", "Get yours today!", "Don't wait!", "Link in bio!"]
  },
  conversational: {
    starters: ["I've been thinking about", "Can we talk about", "Let's chat about", "Here's my take on"],
    endings: ["What's your opinion?", "I'd love to hear from you!", "Join the conversation!"]
  },
  urgent: {
    starters: ["URGENT:", "Breaking:", "Important update:", "Time-sensitive:"],
    endings: ["Act immediately!", "Don't delay!", "This is critical!", "Respond ASAP!"]
  }
};

const platformHashtags = {
  twitter: ["#Twitter", "#SocialMedia", "#TechTalk", "#DigitalMarketing", "#Trending"],
  facebook: ["#Facebook", "#SocialNetworking", "#Community", "#Engagement", "#Social"],
  instagram: ["#Instagram", "#InstaDaily", "#PhotoOfTheDay", "#SocialMedia", "#Content"],
  linkedin: ["#LinkedIn", "#Professional", "#Networking", "#Career", "#Business"],
  tiktok: ["#TikTok", "#Viral", "#ForYou", "#Trending", "#Creative"],
  pinterest: ["#Pinterest", "#Inspiration", "#Ideas", "#Creative", "#Lifestyle"]
};

const generateTopicHashtags = (topic: string): string[] => {
  const words = topic.toLowerCase().split(/\s+/);
  const hashtags = words
    .filter(word => word.length > 3)
    .slice(0, 3)
    .map(word => word.replace(/[^\w]/g, ''));
  
  return hashtags;
};

const generateContentForPlatform = (
  topic: string,
  platform: string,
  tone: string,
  targetLength: number,
  includeHashtags: boolean,
  includeEmojis: boolean
): GeneratedContent => {
  const toneTemplate = toneTemplates[tone as keyof typeof toneTemplates];
  const limit = platformLimits[platform as keyof typeof platformLimits];
  
  // Generate content based on platform and tone
  let content = '';
  
  if (platform === 'twitter') {
    content = generateTwitterContent(topic, toneTemplate, targetLength, includeEmojis);
  } else if (platform === 'linkedin') {
    content = generateLinkedInContent(topic, toneTemplate, targetLength, includeEmojis);
  } else if (platform === 'instagram') {
    content = generateInstagramContent(topic, toneTemplate, targetLength, includeEmojis);
  } else if (platform === 'facebook') {
    content = generateFacebookContent(topic, toneTemplate, targetLength, includeEmojis);
  } else if (platform === 'tiktok') {
    content = generateTikTokContent(topic, toneTemplate, targetLength, includeEmojis);
  } else {
    content = generateGenericContent(topic, toneTemplate, targetLength, includeEmojis);
  }

  // Ensure content doesn't exceed platform limit
  if (content.length > limit) {
    content = content.substring(0, limit - 3) + '...';
  }

  // Generate hashtags
  let hashtags: string[] = [];
  if (includeHashtags) {
    const topicTags = generateTopicHashtags(topic);
    const platformTags = platformHashtags[platform as keyof typeof platformHashtags] || [];
    hashtags = [...topicTags, ...platformTags.slice(0, 2)];
  }

  // Calculate engagement score (mock algorithm)
  const engagementScore = Math.floor(Math.random() * 30) + 70; // 70-100%

  return {
    id: nanoid(),
    platform,
    content,
    hashtags,
    tone,
    length: content.length,
    engagement_score: engagementScore
  };
};

const generateTwitterContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const starter = toneTemplate.starters[Math.floor(Math.random() * toneTemplate.starters.length)];
  const ending = toneTemplate.endings[Math.floor(Math.random() * toneTemplate.endings.length)];
  
  let content = `${starter} ${topic}. `;
  
  // Add middle content based on target length
  if (targetLength > 50) {
    content += `This is particularly relevant in today's digital landscape. `;
  }
  
  content += ending;
  
  if (includeEmojis && Math.random() > 0.5) {
    const emojis = ['🚀', '💡', '✨', '🎯', '📈', '💪', '🔥', '⭐'];
    content = `${emojis[Math.floor(Math.random() * emojis.length)]} ${content}`;
  }
  
  return content;
};

const generateLinkedInContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const starter = toneTemplate.starters[Math.floor(Math.random() * toneTemplate.starters.length)];
  
  let content = `${starter} ${topic}.\n\n`;
  content += `In my experience, this is a crucial aspect of professional development. `;
  content += `Here are my key takeaways:\n\n`;
  content += `• Understanding the fundamentals\n`;
  content += `• Applying best practices\n`;
  content += `• Continuous learning and adaptation\n\n`;
  content += `What strategies have worked best for you? I'd love to hear your insights in the comments.`;
  
  if (includeEmojis) {
    content = content.replace(/•/g, '📌');
  }
  
  return content;
};

const generateInstagramContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const starter = toneTemplate.starters[Math.floor(Math.random() * toneTemplate.starters.length)];
  const ending = toneTemplate.endings[Math.floor(Math.random() * toneTemplate.endings.length)];
  
  let content = `${starter} ${topic}! `;
  content += `Swipe to see more ➡️\n\n`;
  content += `This has been on my mind lately, and I wanted to share some thoughts with you all. `;
  content += `What do you think about this? Drop a comment below! 👇\n\n`;
  content += ending;
  
  if (includeEmojis) {
    const emojis = ['✨', '💫', '🌟', '💖', '🔥', '💪', '🎉', '🙌'];
    content += ` ${emojis[Math.floor(Math.random() * emojis.length)]}`;
  }
  
  return content;
};

const generateFacebookContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const starter = toneTemplate.starters[Math.floor(Math.random() * toneTemplate.starters.length)];
  
  let content = `${starter} ${topic}.\n\n`;
  content += `I've been reflecting on this topic recently, and I think it's worth sharing with our community. `;
  content += `Here's what I've learned:\n\n`;
  content += `The key is to approach this with an open mind and willingness to learn. `;
  content += `We can all benefit from understanding different perspectives and experiences.\n\n`;
  content += `What are your thoughts? Have you had similar experiences? `;
  content += `I'd love to start a meaningful conversation about this in the comments!`;
  
  return content;
};

const generateTikTokContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const content = `POV: ${topic} 👀\n\nThis is so real! Who else relates? 🙋‍♀️\n\n#fyp #relatable #viral`;
  return content;
};

const generateGenericContent = (topic: string, toneTemplate: any, targetLength: number, includeEmojis: boolean): string => {
  const starter = toneTemplate.starters[Math.floor(Math.random() * toneTemplate.starters.length)];
  const ending = toneTemplate.endings[Math.floor(Math.random() * toneTemplate.endings.length)];
  
  let content = `${starter} ${topic}. `;
  content += `This is an interesting topic that deserves more attention. `;
  content += ending;
  
  return content;
};

export const registerAIContentRoutes = (app: any) => {
  // Generate AI content
  app.post('/api/ai-content/generate', async (req: Request, res: Response) => {
    try {
      const {
        topic,
        platforms,
        tone,
        length,
        include_hashtags,
        include_emojis
      }: ContentRequest = req.body;

      if (!topic || !platforms || platforms.length === 0) {
        return res.status(400).json({
          error: 'Topic and at least one platform are required'
        });
      }

      const generatedContent: GeneratedContent[] = platforms.map(platform =>
        generateContentForPlatform(
          topic,
          platform,
          tone || 'professional',
          length || 50,
          include_hashtags !== false,
          include_emojis === true
        )
      );

      res.json({
        success: true,
        content: generatedContent,
        generated_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI content generation error:', error);
      res.status(500).json({
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get content suggestions based on trending topics
  app.get('/api/ai-content/suggestions', async (req: Request, res: Response) => {
    try {
      const suggestions = [
        'Digital transformation in small businesses',
        'Remote work productivity tips',
        'Sustainable living practices',
        'AI and the future of work',
        'Social media marketing trends',
        'Personal branding strategies',
        'Mental health awareness',
        'Technology innovation',
        'Entrepreneurship journey',
        'Industry best practices'
      ];

      res.json({
        success: true,
        suggestions: suggestions.sort(() => Math.random() - 0.5).slice(0, 5)
      });

    } catch (error) {
      console.error('Content suggestions error:', error);
      res.status(500).json({
        error: 'Failed to get content suggestions'
      });
    }
  });

  // Analyze content performance
  app.post('/api/ai-content/analyze', async (req: Request, res: Response) => {
    try {
      const { content, platform } = req.body;

      if (!content) {
        return res.status(400).json({
          error: 'Content is required for analysis'
        });
      }

      // Mock analysis - in production, this would use actual AI/ML models
      const analysis = {
        engagement_prediction: Math.floor(Math.random() * 30) + 70,
        sentiment_score: Math.random() * 2 - 1, // -1 to 1
        readability_score: Math.floor(Math.random() * 40) + 60,
        hashtag_effectiveness: Math.floor(Math.random() * 25) + 75,
        optimal_posting_time: '2:00 PM - 4:00 PM',
        suggestions: [
          'Consider adding more engaging questions',
          'Include relevant hashtags for better reach',
          'Add visual elements to increase engagement',
          'Optimize posting time for your audience'
        ]
      };

      res.json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error('Content analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze content'
      });
    }
  });
};
