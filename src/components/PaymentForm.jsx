import React, { useState } from "react";
// import { stripePromise } from '../lib/stripe'; // Will be used in production
import { databases } from "../lib/appwrite";
import { ID } from "appwrite";

const PaymentForm = ({
  bookingData,
  selectedSeats,
  selectedMovie,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const totalAmount = selectedSeats.length * selectedMovie.price;

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const stripe = await stripePromise; // Will be used in production

      // Simulasi payment intent (dalam production, ini harus dari backend)
      // const clientSecret = await createMockPaymentIntent(totalAmount); // Will be used in production

      // Simulasi konfirmasi payment
      const paymentResult = await simulatePaymentConfirmation(paymentData);

      if (paymentResult.success) {
        // Save booking ke Appwrite setelah payment berhasil
        await saveBookingToDatabase();
        onPaymentSuccess(paymentResult);
      } else {
        throw new Error(paymentResult.error);
      }
    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // const createMockPaymentIntent = async (amount) => {
  //   // Simulasi untuk demo - dalam production ini harus API call ke backend
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(`pi_mock_${Date.now()}`);
  //     }, 1000);
  //   });
  // };

  const simulatePaymentConfirmation = async (data) => {
    // Simulasi konfirmasi payment - dalam production ini menggunakan Stripe API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.cardNumber && data.name && data.email) {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}`,
            amount: totalAmount,
          });
        } else {
          resolve({
            success: false,
            error: "Invalid payment data",
          });
        }
      }, 2000);
    });
  };

  const saveBookingToDatabase = async () => {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID;

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        booking_id: parseInt(ID.unique()),
        user_id: parseInt(bookingData.userId || 1),
        movie_id: parseInt(bookingData.id || 1),
        // movie_title: bookingData.title || selectedMovie.name,
        time: bookingData.time || "19:00",
        date: bookingData.date || new Date().toISOString().split("T")[0],
        tickets: selectedSeats.length,
        seats: selectedSeats.join(","),
        total_amount: totalAmount,
        payment_status: "completed",
        created_at: new Date().toISOString(),
      }
    );

    return response;
  };

  return (
    <div className="payment-form">
      <h2>Payment Details</h2>
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p>Movie: {bookingData.title || selectedMovie.name}</p>
        <p>Date: {bookingData.date}</p>
        <p>Time: {bookingData.time}</p>
        <p>Seats: {selectedSeats.join(", ")}</p>
        <p>Tickets: {selectedSeats.length}</p>
        <p>
          <strong>Total: ${totalAmount}</strong>
        </p>
      </div>

      <form onSubmit={handlePayment} className="payment-form-container">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={paymentData.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={paymentData.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleInputChange}
            required
            placeholder="4242 4242 4242 4242"
            maxLength="19"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentData.expiryDate}
              onChange={handleInputChange}
              required
              placeholder="MM/YY"
              maxLength="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleInputChange}
              required
              placeholder="123"
              maxLength="4"
            />
          </div>
        </div>

        <button type="submit" className="payment-submit-btn" disabled={loading}>
          {loading ? "Processing..." : `Pay $${totalAmount}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
