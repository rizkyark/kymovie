import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function DetailPage() {
  document.title = "Movie Details";
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchMovies = async () => {
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/movie/${params.id}?language=en-US`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Fetching failed...");
      }

      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data || []);
      console.log(movieList);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
      console.log(errorMessage);
    }
  };

  // Helper untuk cek apakah jam sudah lewat
  const isTimePassed = (timeStr) => {
    const now = new Date();
    const [h, m] = timeStr.split(":").map(Number);
    const showTime = new Date(now);
    showTime.setHours(h, m, 0, 0);
    return now > showTime;
  };

  // Helper untuk membuat array 7 hari ke depan
  const getNext7Days = () => {
    const days = [];
    const options = { weekday: "short", day: "numeric", month: "short" };
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-US", options),
      });
    }
    return days;
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <div className="pattern">
        <div className="wrapper">
          <div className="card lg:card-side bg-base-100 shadow-sm sm:mx-20 my-10 mb-7">
            <figure>
              <img
                src={
                  movieList?.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movieList?.poster_path}`
                    : "/no-movie.png"
                }
                alt="Album"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{movieList?.original_title}</h2>
              <p className="sm:pr-44 p-0">{movieList?.overview}</p>
              <p>Release Date: {movieList?.release_date}</p>
              <p>Language: {movieList?.original_language}</p>
              <p>Rating: {movieList?.vote_average}</p>
              <p>
                Genres:{" "}
                {movieList?.genres?.map((genre) => genre.name).join(" | ")}
              </p>
              {/* Pilihan tanggal dan jam menonton */}
              <div className="my-4">
                <p className="font-semibold mb-2">Pilih Tanggal:</p>
                <div className="flex flex-wrap gap-2 mb-4 min-w-[300px]">
                  {getNext7Days().map((d) => (
                    <button
                      key={d.date}
                      className={`btn btn-outline btn-sm min-w-[100px] ${
                        selectedDate === d.date ? "btn-active" : ""
                      }`}
                      onClick={() => setSelectedDate(d.date)}
                      type="button"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <p className="font-semibold mb-2">Pilih Jam Tayang:</p>
                <div className="flex flex-wrap gap-2">
                  {["10:00", "13:00", "16:00", "19:00", "21:30"].map((time) => (
                    <button
                      key={time}
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedTime(time);
                        setShowModal(true);
                      }}
                      type="button"
                      disabled={
                        !selectedDate ||
                        (selectedDate ===
                          new Date().toISOString().slice(0, 10) &&
                          isTimePassed(time))
                      }
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Listen</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Choose Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
          <div className="bg-gray-600 rounded-lg p-6 w-80 shadow-lg ">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Pilih Jumlah Tiket
            </h3>
            <p className="mb-2 text-center">
              Jam tayang: <span className="font-bold">{selectedTime}</span>
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                className="btn btn-sm"
                onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                type="button"
              >
                -
              </button>
              <span className="text-lg font-bold">{ticketCount}</span>
              <button
                className="btn btn-sm"
                onClick={() => setTicketCount((c) => c + 1)}
                type="button"
              >
                +
              </button>
            </div>
            <div className="flex justify-between gap-2">
              <button
                className="btn btn-outline btn-sm flex-1"
                onClick={() => setShowModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm flex-1"
                onClick={() => {
                  setShowModal(false);
                  // Navigasi ke halaman seats dengan data yang dipilih
                  navigate("/seats", {
                    state: {
                      id: params.id,
                      userId: user?.$id || null,
                      name: movieList?.original_title,
                      date: selectedDate,
                      time: selectedTime,
                      ticketCount: ticketCount,
                    },
                  });
                }}
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailPage;
