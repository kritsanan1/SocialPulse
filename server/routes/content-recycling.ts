
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerContentRecyclingRoutes(app: Express) {
  
  // Get user's post history for recycling
  app.get("/api/content-recycling/history", isAuthenticated, async (req: any, res) => {
    try {
      const { timeframe, platform, minEngagement } = req.query;
      
      // Mock post history data
      const posts = [
        {
          id: '1',
          content: 'Just launched our new product! Excited to see how it helps businesses grow. #ProductLaunch #Innovation',
          platform: 'twitter',
          publishedAt: '2024-01-15T10:00:00Z',
          metrics: { likes: 45, shares: 12, comments: 8, reach: 1200 },
          engagementRate: 5.4,
          hashtags: ['#ProductLaunch', '#Innovation'],
          recyclable: true
        },
        {
          id: '2',
          content: 'Top 5 productivity tips that changed my workflow this year. What are yours?',
          platform: 'linkedin',
          publishedAt: '2024-01-10T14:30:00Z',
          metrics: { likes: 120, shares: 35, comments: 22, reach: 3500 },
          engagementRate: 5.1,
          hashtags: ['#Productivity', '#WorkTips'],
          recyclable: true
        },
        {
          id: '3',
          content: 'Behind the scenes at our office! Team collaboration at its finest.',
          platform: 'instagram',
          publishedAt: '2024-01-08T16:00:00Z',
          metrics: { likes: 89, shares: 15, comments: 12, reach: 2100 },
          engagementRate: 5.5,
          hashtags: ['#BehindTheScenes', '#TeamWork'],
          recyclable: true
        }
      ];
      
      res.json({
        posts: posts.filter(post => !minEngagement || post.engagementRate >= parseFloat(minEngagement as string)),
        totalCount: posts.length,
        filters: { timeframe, platform, minEngagement }
      });
    } catch (error) {
      console.error("Error fetching post history:", error);
      res.status(500).json({ message: "Failed to fetch post history" });
    }
  });

  // Transform content to different formats
  app.post("/api/content-recycling/transform", isAuthenticated, async (req: any, res) => {
    try {
      const { originalPostId, targetFormat, targetPlatform } = req.body;
      
      if (!originalPostId || !targetFormat) {
        return res.status(400).json({ message: "Original post ID and target format are required" });
      }

      // Mock content transformation
      const transformations = {
        'tweet-thread': generateTweetThread,
        'linkedin-article': generateLinkedInArticle,
        'instagram-carousel': generateInstagramCarousel,
        'video-script': generateVideoScript,
        'infographic-text': generateInfographicText
      };

      const transformer = transformations[targetFormat as keyof typeof transformations];
      if (!transformer) {
        return res.status(400).json({ message: "Invalid target format" });
      }

      const transformedContent = transformer(originalPostId, targetPlatform);
      
      res.json({
        original: { postId: originalPostId },
        transformed: transformedContent,
        suggestions: [
          "Consider updating statistics with current data",
          "Add platform-specific hashtags",
          "Include a call-to-action"
        ]
      });

    } catch (error) {
      console.error("Error transforming content:", error);
      res.status(500).json({ message: "Failed to transform content" });
    }
  });

  // Get recycling suggestions
  app.get("/api/content-recycling/suggestions", isAuthenticated, async (req: any, res) => {
    try {
      const suggestions = [
        {
          id: '1',
          originalPost: {
            id: '1',
            content: 'Just launched our new product!',
            platform: 'twitter',
            engagementRate: 5.4
          },
          suggestions: [
            {
              format: 'LinkedIn Article',
              description: 'Expand into a detailed case study',
              estimatedEffort: 'Medium',
              potentialReach: '+200%'
            },
            {
              format: 'Instagram Carousel',
              description: 'Break down into visual slides',
              estimatedEffort: 'High',
              potentialReach: '+150%'
            }
          ]
        },
        {
          id: '2',
          originalPost: {
            id: '2',
            content: 'Top 5 productivity tips',
            platform: 'linkedin',
            engagementRate: 5.1
          },
          suggestions: [
            {
              format: 'Twitter Thread',
              description: 'Create a detailed thread for each tip',
              estimatedEffort: 'Low',
              potentialReach: '+120%'
            },
            {
              format: 'Video Script',
              description: 'Turn into a short video explanation',
              estimatedEffort: 'High',
              potentialReach: '+300%'
            }
          ]
        }
      ];
      
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });
}

function generateTweetThread(postId: string, platform?: string) {
  return {
    format: 'tweet-thread',
    content: [
      "🧵 Thread: Expanding on our product launch journey 1/5",
      "The idea came from listening to our customers' pain points. We spent months researching and validating the concept. 2/5",
      "Development took 6 months with our amazing team. We focused on user experience and scalability from day one. 3/5",
      "Launch day was incredible! The response exceeded our expectations. Thank you to everyone who supported us. 4/5",
      "What's next? We're already working on v2 based on your feedback. Stay tuned for more updates! 5/5 #ProductLaunch #Innovation"
    ],
    estimatedReach: 2400,
    suggestedTiming: "Tuesday 2-4 PM"
  };
}

function generateLinkedInArticle(postId: string, platform?: string) {
  return {
    format: 'linkedin-article',
    title: "From Idea to Launch: Our Product Development Journey",
    content: `# From Idea to Launch: Our Product Development Journey

## The Beginning
Every great product starts with a problem worth solving. Our journey began when we noticed a gap in the market...

## Research & Validation
Before writing a single line of code, we spent months talking to potential customers...

## Development Process
Our development approach focused on three key principles:
- User-centric design
- Scalable architecture  
- Continuous feedback loops

## Launch Day
The excitement was palpable as we pressed the "launch" button...

## What's Next
Based on the incredible feedback we've received, here's what's coming in v2...

What challenges have you faced in your product launches? I'd love to hear your stories in the comments.

#ProductLaunch #Innovation #StartupJourney`,
    estimatedReadTime: "4 min read",
    suggestedTags: ["#ProductLaunch", "#Innovation", "#StartupJourney"]
  };
}

function generateInstagramCarousel(postId: string, platform?: string) {
  return {
    format: 'instagram-carousel',
    slides: [
      {
        type: 'cover',
        text: 'Our Product Launch Journey',
        design: 'Bold title with gradient background'
      },
      {
        type: 'content',
        text: 'Problem Identified\nWe listened to customer pain points',
        design: 'Icon + short text'
      },
      {
        type: 'content', 
        text: 'Research Phase\n6 months of validation',
        design: 'Statistics visualization'
      },
      {
        type: 'content',
        text: 'Development\nUser-centric approach',
        design: 'Process diagram'
      },
      {
        type: 'cta',
        text: 'Check out our new product!\nLink in bio',
        design: 'Call-to-action with button'
      }
    ],
    caption: "Swipe to see our complete product launch journey! 🚀 From identifying the problem to launch day - it's been an incredible ride. What's your biggest product launch challenge? Tell us below! 👇\n\n#ProductLaunch #Innovation #StartupJourney #BehindTheScenes",
    hashtags: ['#ProductLaunch', '#Innovation', '#StartupJourney', '#BehindTheScenes']
  };
}

function generateVideoScript(postId: string, platform?: string) {
  return {
    format: 'video-script',
    duration: '60 seconds',
    scenes: [
      {
        time: '0-5s',
        action: 'Hook',
        script: 'What if I told you our product launch exceeded expectations by 300%?',
        visual: 'Attention-grabbing statistic overlay'
      },
      {
        time: '5-15s', 
        action: 'Problem',
        script: 'It all started when we noticed customers struggling with...',
        visual: 'Show the problem being solved'
      },
      {
        time: '15-35s',
        action: 'Solution',
        script: 'So we built something different. Here\'s how...',
        visual: 'Product demo/features'
      },
      {
        time: '35-50s',
        action: 'Results',
        script: 'The results speak for themselves...',
        visual: 'Success metrics and testimonials'
      },
      {
        time: '50-60s',
        action: 'CTA',
        script: 'Ready to try it yourself? Link in bio!',
        visual: 'Clear call-to-action'
      }
    ],
    notes: 'Keep energy high, use engaging visuals, add captions for accessibility'
  };
}

function generateInfographicText(postId: string, platform?: string) {
  return {
    format: 'infographic-text',
    title: 'Product Launch Success Formula',
    sections: [
      {
        heading: 'Research',
        points: ['6 months validation', '100+ customer interviews', 'Market analysis']
      },
      {
        heading: 'Development', 
        points: ['User-centric design', 'Agile methodology', 'Continuous testing']
      },
      {
        heading: 'Launch',
        points: ['Coordinated marketing', 'Community engagement', 'Feedback collection']
      },
      {
        heading: 'Results',
        points: ['300% above target', '95% customer satisfaction', 'Featured in 5 publications']
      }
    ],
    designSuggestions: [
      'Use brand colors consistently',
      'Include icons for each section',
      'Add progress bars for statistics',
      'Keep text hierarchy clear'
    ]
  };
}
