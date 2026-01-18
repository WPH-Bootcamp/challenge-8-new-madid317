import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
};

const STORAGE_KEY = "favorite_movies";

const MovieSearchCard = ({ movie }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // CHECK FAVORITE
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const favorites: Movie[] = JSON.parse(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFavorite(favorites.some((m) => m.id === movie.id));
  }, [movie.id]);

  // TOGGLE FAVORITE
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const stored = localStorage.getItem(STORAGE_KEY);
    const favorites: Movie[] = stored ? JSON.parse(stored) : [];

    let updated: Movie[];

    if (isFavorite) {
      updated = favorites.filter((m) => m.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="relative flex gap-6 bg-black/40 rounded-xl p-4 hover:bg-black/60 transition cursor-pointer">
        {/* FAVORITE */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10"
        >
          {isFavorite ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ef4444"
              className="w-7 h-7"
            >
              <path d="M12 21s-6.7-4.4-9.3-7.2C.9 11.9 1.2 8.6 3.5 6.7c2-1.6 4.9-1.2 6.6.7L12 9.4l1.9-2c1.7-1.9 4.6-2.3 6.6-.7 2.3 1.9 2.6 5.2.8 7.1C18.7 16.6 12 21 12 21z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              className="w-7 h-7"
            >
              <path d="M12 21s-6.7-4.4-9.3-7.2C.9 11.9 1.2 8.6 3.5 6.7c2-1.6 4.9-1.2 6.6.7L12 9.4l1.9-2c1.7-1.9 4.6-2.3 6.6-.7 2.3 1.9 2.6 5.2.8 7.1C18.7 16.6 12 21 12 21z" />
            </svg>
          )}
        </button>

        {/* POSTER */}
        <div className="w-44 shrink-0">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg"
            />
          ) : (
            <div className="h-40 bg-white/10 rounded flex items-center justify-center text-white/40 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white text-lg font-semibold text-left">
            {movie.title}
          </h3>

          <div className="text-sm text-white text-left">
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </div>

          <p className="text-white/70 text-sm line-clamp-3 leading-7 text-left">
            {movie.overview || "No description available."}
          </p>

          <button
            onClick={(e) => e.preventDefault()}
            className="mt-2 w-fit px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full flex items-center gap-2"
          >
            Watch Trailer
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#961200"
                className="w-5 h-5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MovieSearchCard;


