import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import type { MovieDetail } from "../types/movieDetail";
import frameImg from "../assets/frame.svg"
import removeFav from "../assets/HeartFilledMobile.svg";

const STORAGE_KEY = "favorite_movies";

const Favorites = () => {
  const [favorites, setFavorites] = useState<MovieDetail[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();

  const toggleFavorite = (movie: MovieDetail) => {
    const updatedFavorites = favorites.filter((m) => m.id !== movie.id);
    setFavorites(updatedFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
  };

  const watchTrailer = (movie: MovieDetail) => {
    alert(`Watch trailer for ${movie.title}`);
  };

  // Redirect To Home
  const goHome = () => {
    navigate("/"); 
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white pt-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 w-full text-left">
            Favorites
          </h1>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              <img
                src={frameImg}
                alt="No favorites"
                className="w-48 h-48 object-contain"
              />
              <h1 className="text-white text-center font-bold max-w-xs">
                Data Empty
              </h1>
              <p className="text-white/60 text-center max-w-xs">
                You don't have a favorite movie yet
              </p>
              <button
                onClick={goHome}
                className="px-24 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold"
              >
                Explore Movie
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10 w-full">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-xl overflow-hidden flex flex-col md:flex-row gap-6 p-6 border-b border-gray-700 last:border-b-0"
                >
                  {/* Poster */}
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full md:w-48 h-auto rounded-xl object-cover"
                  />

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-start gap-7">
                    {/* Title + Favorite */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">{movie.title}</h2>
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className="w-10 h-10"
                      >
                        <img
                          src={removeFav}
                          alt="Remove favorite"
                          className="w-full h-full"
                        />
                      </button>
                    </div>

                    {/* Rating */}
                    <p className="text-white text-left">
                      ⭐ {movie.vote_average.toFixed(1)} / 10
                    </p>

                    {/* Overview */}
                    <p className="text-white/60 line-clamp-2 leading-7 text-left">
                      {movie.overview}
                    </p>

                    {/* Watch Trailer */}
                    <button
                      className="px-8 py-3 bg-red-700 hover:bg-red-600 rounded-full text-sm font-semibold flex items-center gap-2 w-fit"
                      onClick={() => watchTrailer(movie)}
                    >
                      Watch Trailer
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#fff"
                        className="w-4 h-4"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Favorites;