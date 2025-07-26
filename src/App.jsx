import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./utils/AuthContext";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  document.title = "KyMovie - Find Movies You'll Enjoy";
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const fetchMovies = async () => {
    setisLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

      setMovieList(data.results || []);
      console.log(movieList);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // console.log(user.emailVerification);
  }, []);

  const handleDetailEvent = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="pattern">
        <div className="wrapper">
          <header>
            {/* <img src="hero.png" alt="" /> */}
            <img src="kymovie_logo.png" alt="hero" className="h-100" />
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without The Hassle
            </h1>
            <h1 className="text-white">{searchTerm}</h1>
          </header>

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    handleDetail={handleDetailEvent}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
