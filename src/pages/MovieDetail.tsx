import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from "react";
import { getMovieDetail, getMovieCredits, getMovieVideos } from "../services/tmdb";
import Navbar from "../components/navbar";
import HeroBackground from "../components/heroBackground";
import Footer from "../components/footer";
import type { MovieDetail as MovieDetailType } from "../types/movieDetail";
import type { MovieCreditsResponse } from "../types/movieDetail";
import type { MovieVideosResponse } from "../types/movieDetail";
import starBlock from "../assets/star-rating.svg";
import calenderIcon from "../assets/CalendarMobile.svg";
import genreIcon from "../assets/genre-symbol.svg";
import ageIcon from "../assets/age-symbol.svg";
import heartOutline from "../assets/heart-outline.svg";
import heartFilled from "../assets/HeartFilledMobile.svg";
import { getTmdbImageUrl, formatRuntime } from "../types/movieDetail";

const STORAGE_KEY = "favorite_movies";

// Helper function to get favorites from localStorage
const getFavoritesFromStorage = (): MovieDetailType[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing favorites from localStorage:", error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (favorites: MovieDetailType[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

// Helper function to safely get image URL
const getSafeImageUrl = (
  path: string | null, 
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "original"
): string => {
  if (!path) return "/assets/avatar-placeholder.png";
  const url = getTmdbImageUrl(path, size);
  return url || "/assets/avatar-placeholder.png";
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Convert ID to number and validate it
  const movieId = Number(id);
  const isValidId = Number.isFinite(movieId) && movieId > 0;

  // ALL HOOKS MUST BE CALLED HERE, BEFORE ANY CONDITIONAL RETURNS
  const { data, isLoading, isError, error } = useQuery<MovieDetailType>({
    queryKey: ["movie-detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidId,
    retry: 1,
  });

  const { data: credits } = useQuery<MovieCreditsResponse>({
    queryKey: ["movie-credits", movieId],
    queryFn: () => getMovieCredits(movieId),
    enabled: isValidId,
    retry: 1,
  });

  const { data: videos } = useQuery<MovieVideosResponse>({
    queryKey: ["movie-videos", movieId],
    queryFn: () => getMovieVideos(movieId),
    enabled: isValidId,
    retry: 1,
  });

  // Initialize isFavorite when data changes - using useLayoutEffect
  useLayoutEffect(() => {
    if (!data) return;

    const favorites = getFavoritesFromStorage();
    const isFav = favorites.some((movie) => movie.id === data.id);
    setIsFavorite(isFav);
  }, [data]);

  // Listen for storage changes (for multi-tab synchronization) - using setTimeout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (!data) return;

        try {
          const favorites = JSON.parse(e.newValue);
          const isFav = favorites.some(
            (movie: MovieDetailType) => movie.id === data.id,
          );
          
          // Defer the state update to avoid the warning
          setTimeout(() => {
            setIsFavorite(isFav);
          }, 0);
        } catch (error) {
          console.error("Error handling storage change:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [data]);

  // NOW YOU CAN HAVE CONDITIONAL RETURNS
  if (!isValidId) {
    return (
      <div className="text-white pt-32 text-center">
        <p>Invalid movie ID</p>
      </div>
    );
  }

  if (isLoading)
    return <p className="text-white pt-32 text-center">Loading...</p>;

  if (isError || !data) {
    console.error("Movie detail error:", error);
    return (
      <div className="text-white pt-32 text-center">
        <p>Movie not found</p>
        <p className="text-sm text-gray-400 mt-2">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const showCustomToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const toggleFavorite = () => {
    if (!data) return;

    // Get current favorites
    const favorites = getFavoritesFromStorage();

    // Check if movie is already in favorites (using the actual data, not just state)
    const movieIndex = favorites.findIndex((movie) => movie.id === data.id);

    let updatedFavorites: MovieDetailType[];

    if (movieIndex !== -1) {
      // Remove from favorites
      updatedFavorites = favorites.filter((movie) => movie.id !== data.id);
      showCustomToast("Removed from Favorites");
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, data];
      showCustomToast("Added to Favorites");
    }

    // Save to localStorage
    saveFavoritesToStorage(updatedFavorites);

    // Update state - defer to avoid warning
    setTimeout(() => {
      setIsFavorite(movieIndex === -1);
    }, 0);
  };

  // Find the trailer from videos
  const trailer = videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  ) || videos?.results?.find(
    (video) => video.site === "YouTube"
  );

  // Function to watch trailer
  const watchTrailer = () => {
    if (trailer) {
      // Open trailer in a new tab
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    } else {
      showCustomToast("Trailer not available");
    }
  };

  // Use the utility function from your types file
  const formattedDate = new Date(data.release_date).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* TOAST */}
      {showToast && (
        <div
          className="absolute top-30 left-1/2 transform -translate-x-1/2 max-w-xs md:max-w-md w-full
                backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-lg 
                flex items-center justify-center gap-3 z-50"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-sm">✔</span>
          </div>
          <span className="text-center">{toastMessage}</span>
        </div>
      )}

      <Navbar />
      <HeroBackground data={data} />

      {/* HERO SECTION */}
      <section className="w-full mt-96 z-10">
        <div className="relative max-w-6xl mx-auto px-6 pt-32 md:pt-40 flex flex-col md:flex-row gap-10">
          {/* POSTER - Using getSafeImageUrl helper function */}
          <img
            src={getSafeImageUrl(data.poster_path, "w500")}
            alt={data.title}
            className="rounded-xl w-64 h-auto shadow-lg shrink-0 md:w-72 lg:w-80"
          />

          {/* CONTENT */}
          <div className="space-y-4 md:space-y-5 flex-1">
            {/* TITLE */}
            <h1 className="text-3xl font-bold text-left">{data.title}</h1>

            {/* RELEASE DATE */}
            <p className="text-sm text-white text-left flex items-center gap-2">
              <img
                src={calenderIcon}
                alt=""
                aria-hidden="true"
                className="block w-4 h-4"
              />
              {formattedDate}
            </p>

            {/* RUNTIME - Using formatRuntime utility function */}
            <p className="text-sm text-white text-left flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatRuntime(data.runtime)}
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-4">
              <button 
                onClick={watchTrailer}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm flex items-center gap-2"
                disabled={!trailer}
              >
                Watch Trailer
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#991b1b"
                    className="w-4 h-4"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>

              <button
                onClick={toggleFavorite}
                className="w-10 h-10 transition-transform hover:scale-110"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <img
                  src={isFavorite ? heartFilled : heartOutline}
                  alt="favorite"
                  className="w-full h-full"
                />
              </button>
            </div>

            {/* INFO BOX */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              {/* RATING */}
              <div className="bg-black border-slate-800 border-2 w-full h-36 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <img
                  src={starBlock}
                  alt=""
                  aria-hidden="true"
                  className="block w-7 h-7"
                />

                <p className="text-sm text-white/70 mb-1">Rating</p>
                <p className="font-semibold">
                  {data.vote_average.toFixed(1)} / 10
                </p>
              </div>

              {/* GENRE */}
              <div className="bg-black border-slate-800 border-2 w-full h-36 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <img src={genreIcon} alt="Genre" className="w-7 h-7" />
                <p className="text-sm text-white/70 mb-1">Genre</p>
                <p className="font-semibold">
                  {data.genres && data.genres.length > 0
                    ? data.genres[0].name
                    : "N/A"}
                </p>
              </div>

              {/* AGE */}
              <div className="bg-black border-slate-800 border-2 w-full h-36 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <img src={ageIcon} alt="Age" className="w-7 h-7" />
                <p className="text-sm text-white/70 mb-1">Age Limit</p>
                <p className="font-semibold">{data.age || "13+"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-[32px] font-semibold mb-4 text-left">Overview</h2>
        <p className="text-white/70 leading-7 line-clamp-none md:line-clamp-2 text-left">
          {data.overview}
        </p>
      </main>

      {/* CAST & CREW */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-[32px] font-semibold mb-6 text-left">
          Cast & Crew
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-20 justify-items-start">
          {credits?.cast?.slice(0, 5).map((actor) => (
            <div key={actor.id} className="flex flex-row text-left gap-5">
              <img
                src={getSafeImageUrl(actor.profile_path, "w185")}
                alt={actor.name}
                className="w-24 h-35 rounded-lg object-cover mb-3"
              />
              <div className="flex flex-col justify-center">
                <p className="text-[16px] font-semibold">{actor.name}</p>
                <p className="text-[16px] text-white/60">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MovieDetail;