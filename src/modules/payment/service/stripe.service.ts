import Stripe from "stripe";

export class StripeService {
    public stripe: Stripe;

    constructor() {
      const apiVersion = process.env.STRIPE_API_VERSION;
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: apiVersion as Stripe.StripeConfig['apiVersion'],
      });
    }
}