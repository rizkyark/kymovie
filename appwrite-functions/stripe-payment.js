// Appwrite Function untuk menghandle Stripe Payment
// File: functions/stripe-payment/src/main.js

import { Client, Databases, ID } from "node-appwrite";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async ({ req, res, log, error }) => {
  // Enable CORS
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return res.json({}, 200, headers);
  }

  try {
    const { action, ...data } = JSON.parse(req.body);

    switch (action) {
      case "create-payment-intent":
        return await createPaymentIntent(data, res, headers, log);

      case "confirm-payment":
        return await confirmPayment(data, res, headers, log);

      case "webhook":
        return await handleWebhook(req, res, headers, log);

      default:
        return res.json({ error: "Invalid action" }, 400, headers);
    }
  } catch (err) {
    error("Error processing request:", err);
    return res.json({ error: err.message }, 500, headers);
  }
};

async function createPaymentIntent(data, res, headers, log) {
  try {
    const { amount, currency = "usd", bookingData } = data;

    // Buat Payment Intent di Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        booking_id: bookingData.booking_id || "",
        movie_id: bookingData.movie_id || "",
        user_id: bookingData.user_id || "",
      },
    });

    log("Payment Intent created:", paymentIntent.id);

    return res.json(
      {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      },
      200,
      headers
    );
  } catch (err) {
    return res.json({ error: err.message }, 400, headers);
  }
}

async function confirmPayment(data, res, headers, log) {
  try {
    const { paymentIntentId, bookingData } = data;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Save booking to Appwrite database
      const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

      const databases = new Databases(client);

      const booking = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_BOOKING_COLLECTION_ID,
        ID.unique(),
        {
          ...bookingData,
          payment_intent_id: paymentIntent.id,
          payment_status: "completed",
          amount: paymentIntent.amount / 100,
          created_at: new Date().toISOString(),
        }
      );

      log("Booking saved:", booking.$id);

      return res.json(
        {
          success: true,
          booking_id: booking.$id,
          payment_intent: paymentIntent,
        },
        200,
        headers
      );
    } else {
      return res.json(
        {
          success: false,
          error: "Payment not completed",
          status: paymentIntent.status,
        },
        400,
        headers
      );
    }
  } catch (err) {
    return res.json({ error: err.message }, 500, headers);
  }
}

async function handleWebhook(req, res, headers, log) {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    log("Webhook event type:", event.type);

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        log("Payment succeeded:", paymentIntent.id);
        // Update booking status in database
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        log("Payment failed:", failedPayment.id);
        // Handle failed payment
        break;

      default:
        log("Unhandled event type:", event.type);
    }

    return res.json({ received: true }, 200, headers);
  } catch (err) {
    return res.json({ error: err.message }, 400, headers);
  }
}
