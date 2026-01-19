import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMovie } from "../services/tmdb";
import type { Movie } from "../types/movie";
import starBlock from "../assets/star-rating.svg";

export default function Trending() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useQuery<Movie[]>({
    queryKey: ["trending"],
    queryFn: getMovie,
  });

  const scroll = (offset: number) => {
    sliderRef.current?.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  if (isLoading) return <p className="text-white px-6">Loading...</p>;
  if (isError)
    return <p className="text-white px-6">Error: {(error as Error).message}</p>;

  return (
    <section className="bg-black py-14 text-white">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* TITLE */}
        <h1 className="font-bold text-2xl md:text-3xl mb-6 text-left">
          Trending Now
        </h1>

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll(-300)}
          className="absolute -left-10 top-1/2 -translate-y-1/2 z-30
                     text-white text-4xl opacity-70 hover:opacity-100 transition"
        >
          ❮
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll(300)}
          className="absolute -right-10 top-1/2 -translate-y-1/2 z-30
                     text-white text-4xl opacity-70 hover:opacity-100 transition"
        >
          ❯
        </button>

        {/* SLIDER WRAPPER (BATAS TAMPIL) */}
        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {(data ?? []).slice(0, 10).map((movie, index) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="relative w-40 md:w-48 shrink-0
                           transition-transform duration-300 hover:scale-105"
              >
                {/* RANK */}
                <div
                  className="absolute top-2 left-2 z-20
                             w-8 h-8 rounded-full
                             bg-black/70
                             flex items-center justify-center
                             text-xs font-bold text-white"
                >
                  {index + 1}
                </div>

                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/assets/no-poster.png"
                  }
                  alt={movie.title}
                  className="w-full aspect-2/3 object-cover rounded-xl"
                />

                <p className="mt-2 text-sm font-semibold truncate text-left">
                  {movie.title}
                </p>

                <div className="flex items-center gap-1 text-xs text-white/50">
                  <img
                    src={starBlock}
                    alt=""
                    aria-hidden="true"
                    className="block size-4.5"
                  />
                  <span className="text-white/50">{movie.vote_average.toFixed(1)} / 10</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}