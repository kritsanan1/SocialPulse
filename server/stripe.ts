
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const PRICING_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 29,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    features: [
      'Up to 5 social accounts',
      '50 posts per month',
      'Basic analytics',
      'Content scheduling',
      'Email support'
    ],
    limits: {
      accounts: 5,
      posts: 50,
      analytics: 'basic',
      support: 'email'
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 59,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Up to 15 social accounts',
      '200 posts per month',
      'Advanced analytics',
      'AI content generation',
      'Team collaboration (5 members)',
      'Priority support'
    ],
    limits: {
      accounts: 15,
      posts: 200,
      analytics: 'advanced',
      teamMembers: 5,
      support: 'priority'
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Advanced analytics & reporting',
      'AI content generation',
      'Unlimited team members',
      'White-label options',
      'Dedicated support',
      'Custom integrations'
    ],
    limits: {
      accounts: 'unlimited',
      posts: 'unlimited',
      analytics: 'enterprise',
      teamMembers: 'unlimited',
      support: 'dedicated'
    }
  }
};

export function validateWebhookSignature(body: string, signature: string): boolean {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('STRIPE_WEBHOOK_SECRET not found');
    return false;
  }

  try {
    stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

export function getPlanByPriceId(priceId: string) {
  return Object.values(PRICING_PLANS).find(plan => plan.priceId === priceId);
}
