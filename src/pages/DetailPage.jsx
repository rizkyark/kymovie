import { useEffect, useState } from "react";
import { useParams } from "react-router";

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
  const params = useParams();

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
                // className="h-500 w-500 object-cover"
                // style={{ maxWidth: "500px", maxHeight: "500px" }}
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{movieList?.original_title}</h2>
              <p className="pr-44">{movieList?.overview}</p>
              <p>Release Date: {movieList?.release_date}</p>
              <p>Language: {movieList?.original_language}</p>
              <p>Rating: {movieList?.vote_average}</p>
              <p>
                Genres:{" "}
                {movieList?.genres?.map((genre) => genre.name).join(" | ")}
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Listen</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPage;
