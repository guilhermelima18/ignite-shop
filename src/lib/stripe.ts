import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(SECRET_KEY!, {
  apiVersion: "2022-11-15",
  appInfo: {
    name: "Ignite Shop",
  },
});
