import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    // Request ke backend Appwrite Function yang sudah disediakan
    const response = await fetch(
      "https://68b97a700016b80522b4.fra.appwrite.run/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          bookingData: arguments[2] || {},
        }),
      }
    );

    const { client_secret } = await response.json();
    return client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (stripe, clientSecret, paymentData) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentData.card,
        billing_details: {
          name: paymentData.name,
          email: paymentData.email,
        },
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export { stripePromise };
