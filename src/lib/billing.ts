import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
});

export interface BillingConfig {
  priceId: string;
  renderCreditPrice: number; // Price per render credit
  freeCredits: number; // Free credits per month
}

const BILLING_CONFIG: BillingConfig = {
  priceId: process.env.STRIPE_PRICE_ID || '',
  renderCreditPrice: 0.10, // $0.10 per render credit
  freeCredits: 10, // 10 free renders per month
};

/**
 * Create a Stripe checkout session for render credits
 */
export async function createCheckoutSession(
  customerId: string,
  creditAmount: number,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: BILLING_CONFIG.priceId,
        quantity: creditAmount,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      creditAmount: creditAmount.toString(),
    },
  });

  return session.url || '';
}

/**
 * Create a Stripe customer
 */
export async function createCustomer(
  email: string,
  name?: string
): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer.id;
}

/**
 * Record usage for metered billing
 */
export async function recordUsage(
  orgId: string,
  renderJobId: string,
  amount: number
): Promise<void> {
  const { pool } = await import('./db');

  // Record usage in database
  await pool.query(
    `INSERT INTO usage_records (org_id, render_job_id, amount, quantity, unit)
     VALUES ($1, $2, $3, 1, 'render_job')`,
    [orgId, renderJobId, amount]
  );

  // In production, this would report usage to Stripe for metered billing
  // For the render credits model, we deduct from prepaid credits instead
  await deductRenderCredits(orgId, 1);
}

/**
 * Deduct render credits from organization
 */
async function deductRenderCredits(orgId: string, credits: number): Promise<void> {
  const { pool } = await import('./db');

  // This would be implemented with a credits table or Stripe subscription
  // For now, we'll just log the deduction
  console.log(`Deducting ${credits} render credits from org ${orgId}`);
}

/**
 * Get organization's credit balance
 */
export async function getCreditBalance(orgId: string): Promise<number> {
  const { pool } = await import('./db');

  // This would query a credits table or Stripe subscription
  // For now, return free credits
  return BILLING_CONFIG.freeCredits;
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const { pool } = await import('./db');

  const creditAmount = parseInt(session.metadata?.creditAmount || '0');
  const customerId = session.customer as string;

  // Add credits to customer's organization
  // This would update a credits table
  console.log(`Adding ${creditAmount} credits to customer ${customerId}`);
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;

  // Renew monthly credits for subscription
  console.log(`Renewing credits for customer ${customerId}`);
}

/**
 * Handle subscription change
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  // Update subscription status
  console.log(`Subscription ${subscription.id} changed for customer ${customerId}`);
}

/**
 * Create a subscription for recurring credits
 */
export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<string> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription.id;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId);
}
