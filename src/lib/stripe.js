import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    // Dalam implementasi production, ini harus dipanggil ke backend Anda
    // Untuk demo, kita simulasikan response dari backend
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Stripe menggunakan cents
        currency,
      }),
    });

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
