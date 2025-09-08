// import React, { useState } from "react";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import {
//   stripePromise,
//   createPaymentIntent,
//   confirmPayment,
// } from "../lib/stripe";
// // // Will be used in production
// import { databases } from "../lib/appwrite";
// import { ID } from "appwrite";

// const PaymentForm = ({
//   bookingData,
//   selectedSeats,
//   selectedMovie,
//   onPaymentSuccess,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [paymentData, setPaymentData] = useState({
//     name: "",
//     email: "",
//   });
//   const stripe = useStripe();
//   const elements = useElements();

//   const totalAmount = selectedSeats.length * selectedMovie.price;

//   const handleInputChange = (e) => {
//     setPaymentData({
//       ...paymentData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!stripe || !elements) {
//         throw new Error("Stripe.js belum siap");
//       }
//       // Buat payment intent ke backend, kirim data booking
//       const clientSecret = await createPaymentIntent(totalAmount, "usd", {
//         booking_id: bookingData.booking_id || ID.unique(),
//         movie_id: bookingData.id || selectedMovie.id,
//         user_id: bookingData.userId || 1,
//         seats: selectedSeats.join(","),
//         tickets: selectedSeats.length,
//         total_amount: totalAmount,
//         name: paymentData.name,
//         email: paymentData.email,
//       });

//       // Proses pembayaran dengan PaymentElement
//       const result = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: window.location.href,
//         },
//         redirect: "if_required",
//       });

//       if (result.error) {
//         throw new Error(result.error.message);
//       }

//       if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
//         await saveBookingToDatabase();
//         onPaymentSuccess({
//           success: true,
//           paymentId: result.paymentIntent.id,
//           amount: totalAmount,
//         });
//       } else {
//         throw new Error("Payment failed or not completed.");
//       }
//     } catch (error) {
//       alert("Payment failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fungsi mock dihapus, sekarang menggunakan Stripe API asli

//   const saveBookingToDatabase = async () => {
//     const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
//     const collectionId = import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID;

//     const response = await databases.createDocument(
//       databaseId,
//       collectionId,
//       ID.unique(),
//       {
//         booking_id: parseInt(ID.unique()),
//         user_id: parseInt(bookingData.userId || 1),
//         movie_id: parseInt(bookingData.id || 1),
//         // movie_title: bookingData.title || selectedMovie.name,
//         time: bookingData.time || "19:00",
//         date: bookingData.date || new Date().toISOString().split("T")[0],
//         tickets: selectedSeats.length,
//         seats: selectedSeats.join(","),
//         total_amount: totalAmount,
//         payment_status: "completed",
//         created_at: new Date().toISOString(),
//       }
//     );

//     return response;
//   };

//   return (
//     <div className="payment-form">
//       <h2>Payment Details</h2>
//       <div className="booking-summary">
//         <h3>Booking Summary</h3>
//         <p>Movie: {bookingData.title || selectedMovie.name}</p>
//         <p>Date: {bookingData.date}</p>
//         <p>Time: {bookingData.time}</p>
//         <p>Seats: {selectedSeats.join(", ")}</p>
//         <p>Tickets: {selectedSeats.length}</p>
//         <p>
//           <strong>Total: ${totalAmount}</strong>
//         </p>
//       </div>

//       <form onSubmit={handlePayment} className="payment-form-container">
//         <div className="form-group">
//           <label htmlFor="name">Full Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={paymentData.name}
//             onChange={handleInputChange}
//             required
//             placeholder="John Doe"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={paymentData.email}
//             onChange={handleInputChange}
//             required
//             placeholder="john@example.com"
//           />
//         </div>

//         <div className="form-group">
//           <label>Pembayaran</label>
//           <PaymentElement />
//         </div>

//         <button type="submit" className="payment-submit-btn" disabled={loading}>
//           {loading ? "Processing..." : `Pay $${totalAmount}`}
//         </button>
//       </form>
//     </div>
//   );
// };

// // Bungkus PaymentForm dengan Stripe Elements agar Stripe context tersedia
// const StripePaymentWrapper = (props) => (
//   <Elements stripe={stripePromise}>
//     <PaymentForm {...props} />
//   </Elements>
// );

// export default StripePaymentWrapper;
