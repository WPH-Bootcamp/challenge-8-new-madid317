import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // Import Link
import { getNewRelease } from "../services/tmdb";
import type { Movie } from "../types/movie";
import starBlock from "../assets/star-rating.svg";

const INITIAL_ITEMS = 15;
const LOAD_MORE_ITEMS = 8;

export default function NewReleaseGrid() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

  const { data, isLoading, isError, error } = useQuery<Movie[]>({
    queryKey: ["newReleases"],
    queryFn: getNewRelease,
  });

  if (isLoading) return <p className="text-white px-6">Loading...</p>;
  if (isError)
    return <p className="text-white px-6">Error: {(error as Error).message}</p>;

  const hasMore = data && visibleCount < data.length;

  return (
    <section className="bg-black py-14 text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* TITLE */}
        <h1 className="font-bold text-2xl md:text-3xl mb-6 text-left">
          New Release
        </h1>

        {/* GRID */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {data?.slice(0, visibleCount).map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`} // Add Link with navigation
                className="transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/assets/no-poster.png"
                  }
                  alt={movie.title}
                  className="w-full aspect-2/3 object-cover rounded-xl"
                />

                <p className="mt-2 text-xs md:text-sm font-semibold truncate text-left">
                  {movie.title}
                </p>

                <div className="flex items-center gap-1 text-xs text-white/50">
                  <img
                    src={starBlock}
                    alt=""
                    aria-hidden="true"
                    className="block size-4.5"
                  />
                  <span>{movie.vote_average.toFixed(1)} / 10</span>
                </div>
              </Link>
            ))}
          </div>

          {/* GRADIENT OVERLAY */}
          {hasMore && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-90 bg-linear-to-t from-black via-black/70 to-transparent" />
          )}

          {/* LOAD MORE BUTTON */}
          {hasMore && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + LOAD_MORE_ITEMS)
                }
                className="h-11 rounded-full bg-[#0A0D1299] px-6 font-semibold text-white backdrop-blur-xl border border-[#181D27]"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}