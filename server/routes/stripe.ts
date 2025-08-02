
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { stripe, PRICING_PLANS, validateWebhookSignature, getPlanByPriceId } from "../stripe";
import { storage } from "../storage";
import express from "express";

export function registerStripeRoutes(app: Express) {
  
  // Get pricing plans
  app.get("/api/pricing", async (req, res) => {
    try {
      res.json({
        plans: Object.values(PRICING_PLANS),
        currency: 'usd'
      });
    } catch (error) {
      console.error("Error fetching pricing:", error);
      res.status(500).json({ message: "Failed to fetch pricing" });
    }
  });

  // Get current subscription
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscriptionByUserId(userId);
      
      if (!subscription) {
        return res.json({ 
          subscription: null,
          plan: null,
          status: 'no_subscription'
        });
      }

      const plan = Object.values(PRICING_PLANS).find(p => p.id === subscription.plan);
      
      res.json({
        subscription,
        plan,
        status: subscription.status
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Create checkout session
  app.post("/api/create-checkout-session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { planId } = req.body;

      const plan = PRICING_PLANS[planId.toUpperCase()];
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has a subscription
      const existingSubscription = await storage.getSubscriptionByUserId(userId);
      if (existingSubscription && existingSubscription.status === 'active') {
        return res.status(400).json({ message: "User already has an active subscription" });
      }

      let customerId = existingSubscription?.stripeCustomerId;

      // Create or retrieve Stripe customer
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: userId
          }
        });
        customerId = customer.id;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: userId,
          planId: plan.id
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Create customer portal session
  app.post("/api/create-portal-session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscriptionByUserId(userId);

      if (!subscription || !subscription.stripeCustomerId) {
        return res.status(400).json({ message: "No subscription found" });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${req.headers.origin}/billing`,
      });

      res.json({ url: portalSession.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ message: "Failed to create portal session" });
    }
  });

  // Get billing history
  app.get("/api/billing-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const billingHistory = await storage.getBillingHistory(userId);
      res.json(billingHistory);
    } catch (error) {
      console.error("Error fetching billing history:", error);
      res.status(500).json({ message: "Failed to fetch billing history" });
    }
  });

  // Get usage statistics
  app.get("/api/usage", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const month = new Date().toISOString().slice(0, 7);
      const usage = await storage.getOrCreateUsageTracking(userId, month);
      const subscription = await storage.getSubscriptionByUserId(userId);
      
      let limits = null;
      if (subscription) {
        const plan = Object.values(PRICING_PLANS).find(p => p.id === subscription.plan);
        limits = plan?.limits || null;
      }

      res.json({
        usage,
        limits,
        month
      });
    } catch (error) {
      console.error("Error fetching usage:", error);
      res.status(500).json({ message: "Failed to fetch usage" });
    }
  });

  // Stripe webhooks
  app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!validateWebhookSignature(req.body.toString(), sig)) {
      return res.status(400).send('Webhook signature verification failed');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as any);
          break;
        
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as any);
          break;
        
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as any);
          break;
        
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as any);
          break;
        
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as any);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).send('Webhook error');
    }
  });
}

async function handleCheckoutSessionCompleted(session: any) {
  const userId = session.metadata.userId;
  const planId = session.metadata.planId;
  
  if (!userId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const plan = PRICING_PLANS[planId.toUpperCase()];
    
    if (!plan) {
      console.error("Invalid plan ID:", planId);
      return;
    }

    await storage.createSubscription({
      userId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscription.id,
      stripePriceId: plan.priceId,
      plan: plan.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    console.log(`Subscription created for user ${userId}, plan ${planId}`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const plan = getPlanByPriceId(subscription.items.data[0].price.id);
    
    await storage.updateSubscriptionByStripeId(subscription.id, {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: plan?.id || 'unknown',
      stripePriceId: subscription.items.data[0].price.id,
    });

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    await storage.updateSubscriptionByStripeId(subscription.id, {
      status: 'canceled',
    });

    console.log(`Subscription deleted: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    const subscription = await storage.getSubscriptionByStripeId(invoice.subscription);
    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    await storage.createBillingRecord({
      userId: subscription.userId,
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amount: (invoice.amount_paid / 100).toString(),
      currency: invoice.currency,
      status: 'paid',
      description: invoice.lines.data[0]?.description || 'Subscription payment',
      invoiceUrl: invoice.hosted_invoice_url,
    });

    console.log(`Invoice payment succeeded: ${invoice.id}`);
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    const subscription = await storage.getSubscriptionByStripeId(invoice.subscription);
    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    await storage.createBillingRecord({
      userId: subscription.userId,
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amount: (invoice.amount_due / 100).toString(),
      currency: invoice.currency,
      status: 'failed',
      description: invoice.lines.data[0]?.description || 'Subscription payment failed',
      invoiceUrl: invoice.hosted_invoice_url,
    });

    console.log(`Invoice payment failed: ${invoice.id}`);
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}
