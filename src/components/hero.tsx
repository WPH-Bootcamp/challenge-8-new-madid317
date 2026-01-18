import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieVideos } from "../services/tmdb";
import type { MovieVideosResponse } from "../types/movieDetail";
import { useState } from "react";

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch movie videos
  const { data: videos } = useQuery<MovieVideosResponse>({
    queryKey: ["movie-videos", movie.id],
    queryFn: () => getMovieVideos(movie.id),
    enabled: !!movie.id,
  });

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
      // Show toast notification if no trailer is available
      setToastMessage("Trailer not available");
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <section className="relative min-h-[80vh] md:h-screen w-full">
      {/* Toast notification */}
      {showToast && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
      
      <div className="relative text-left pt-56 md:pt-[50vh] z-10 container mx-auto px-4 h-full flex flex-col pb-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-5xl font-bold text-white">
            {movie.title}
          </h1>
          <div className="h-35 overflow-y-hidden">
            <p className="text-neutral-400 text-[14px] md:text-[16px] max-w-2xl mb-8 mt-2 md:line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6 flex-col md:flex-row md:-mt-5">
          <button 
            onClick={watchTrailer}
            className="bg-primary-300 cursor-pointer md:text-[16px] h-11 md:h-13 rounded-full hover:bg-red-700 text-white px-8 py-3 flex font-semibold items-center gap-3 justify-center transition-colors"
          >
            Watch Trailer
            <div className="bg-white p-0.5 rounded-full w-4 md:w-5 md:h-5 h-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#961200"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
          <Link
            to={`/movie/${movie.id}`}
            className="md:text-[16px] cursor-pointer md:w-57.5 bg-[#0A0D12]/60 hover:bg-gray-700 border-neutral-900 border rounded-full text-white justify-center flex px-8 py-3 font-semibold transition-colors backdrop-blur-sm"
          >
            See Detail
          </Link>
        </div>
      </div>
    </section>
  );
}