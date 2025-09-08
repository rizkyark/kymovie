import "./SeatsPage.css";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { useLocation, useNavigate } from "react-router-dom";
// import PaymentForm from "../../components/PaymentForm";
// import "../../components/PaymentForm.css";

const movies = [
  {
    name: "Avenger",
    price: 10,
    occupied: [20, 21, 30, 1, 2, 8],
  },
  {
    name: "Joker",
    price: 12,
    occupied: [9, 41, 35, 11, 65, 26],
  },
  {
    name: "Toy story",
    price: 8,
    occupied: [37, 25, 44, 13, 2, 3],
  },
  {
    name: "the lion king",
    price: 9,
    occupied: [10, 12, 50, 33, 28, 47],
  },
];

const seats = Array.from({ length: 8 * 8 }, (_, i) => i);

export default function App() {
  // Ambil data dari state yang dikirim via navigate
  const location = useLocation();
  const navigate = useNavigate();
  const [detailData] = useState(location.state || {});
  const [selectedMovie] = useState(movies[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  // const [showPaymentForm, setShowPaymentForm] = useState(false);
  // Fungsi untuk handle pembayaran langsung ke Stripe
  const handleStripeCheckout = async () => {
    try {
      // Kirim data booking ke backend untuk membuat Stripe Checkout Session
      const response = await fetch(
        "https://68b97a700016b80522b4.fra.appwrite.run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seats: selectedSeats,
            movie: selectedMovie.name,
            price: selectedMovie.price,
            ...detailData,
          }),
        }
      );
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect ke Stripe Checkout
      } else {
        alert("Gagal membuat sesi pembayaran Stripe.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };
  // State gabungan detailData dan selectedSeats
  const [bookingData, setBookingData] = useState({
    ...detailData,
    selectedSeats: [],
  });

  useEffect(() => {
    setBookingData({
      ...detailData,
      selectedSeats: selectedSeats,
    });
    // console.log(bookingData);
  }, [detailData, selectedSeats]);

  const handlePaymentSuccess = (paymentResult) => {
    alert(
      `Payment successful!\nPayment ID: ${paymentResult.paymentId}\nAmount: $${paymentResult.amount}`
    );
    // Redirect ke halaman success atau home
    navigate("/", {
      state: {
        paymentSuccess: true,
        bookingData: bookingData,
        paymentResult: paymentResult,
      },
    });
  };

  // if (showPaymentForm) {
  //   return (
  //     <div className="App">
  //       <PaymentForm
  //         bookingData={bookingData}
  //         selectedSeats={selectedSeats}
  //         selectedMovie={selectedMovie}
  //         onPaymentSuccess={handlePaymentSuccess}
  //       />
  //       <button
  //         className="back-btn"
  //         onClick={() => setShowPaymentForm(false)}
  //         style={{
  //           margin: "1rem auto",
  //           display: "block",
  //           padding: "0.5rem 1rem",
  //           background: "#6c757d",
  //           color: "white",
  //           border: "none",
  //           borderRadius: "5px",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Back to Seat Selection
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <p>{JSON.stringify(bookingData)}</p>
      {/* <Movies
        movie={selectedMovie}
        onChange={(movie) => {
          setSelectedSeats([]);
          setSelectedMovie(movie);
        }}
      /> */}
      <ShowCase />
      <Cinema
        movie={selectedMovie}
        selectedSeats={selectedSeats}
        onSelectedSeatsChange={(selectedSeats) =>
          setSelectedSeats(selectedSeats)
        }
      />

      <p className="info">
        You have selected <span className="count">{selectedSeats.length}</span>{" "}
        seats for the price of{" "}
        <span className="total">
          {selectedSeats.length * selectedMovie.price}$
        </span>
      </p>

      {selectedSeats.length > 0 && (
        <button className="payment-btn" onClick={handleStripeCheckout}>
          Bayar di Stripe (${selectedSeats.length * selectedMovie.price})
        </button>
      )}
    </div>
  );
}

function Movies({ movie, onChange }) {
  return (
    <div className="Movies">
      <label htmlFor="movie">Pick a movie</label>
      <select
        id="movie"
        value={movie.name}
        onChange={(e) => {
          onChange(movies.find((movie) => movie.name === e.target.value));
        }}
      >
        {movies.map((movie) => (
          <option key={movie.name} value={movie.name}>
            {movie.name} (${movie.price})
          </option>
        ))}
      </select>
    </div>
  );
}

function ShowCase() {
  return (
    <ul className="ShowCase">
      <li>
        <span className="seat" /> <small>N/A</small>
      </li>
      <li>
        <span className="seat selected" /> <small>Selected</small>
      </li>
      <li>
        <span className="seat occupied" /> <small>Occupied</small>
      </li>
    </ul>
  );
}

function Cinema({ movie, selectedSeats, onSelectedSeatsChange }) {
  // Ambil ticketCount dari detailData melalui closure
  const location = useLocation();
  const detailData = location.state || {};
  const ticketCount = detailData.ticketCount || 1;

  function handleSelectedState(seat) {
    const isSelected = selectedSeats.includes(seat);
    if (isSelected) {
      onSelectedSeatsChange(
        selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
      );
    } else {
      if (selectedSeats.length < ticketCount) {
        onSelectedSeatsChange([...selectedSeats, seat]);
      } else {
        alert(
          "You cannot select more seats than the number of tickets you ordered."
        );
      }
    }
  }

  return (
    <div className="Cinema">
      <div className="screen" />

      <div className="seats">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = movie.occupied.includes(seat);
          return (
            <span
              tabIndex="0"
              key={seat}
              className={clsx(
                "seat",
                isSelected && "selected",
                isOccupied && "occupied"
              )}
              onClick={isOccupied ? null : () => handleSelectedState(seat)}
              onKeyPress={
                isOccupied
                  ? null
                  : (e) => {
                      if (e.key === "Enter") {
                        handleSelectedState(seat);
                      }
                    }
              }
            />
          );
        })}
      </div>
    </div>
  );
}
