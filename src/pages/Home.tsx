import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../services/tmdb";
import type { Movie } from "../types/movie";

import Navbar from "../components/Navbar";
import Background from "../components/background";
import Hero from "../components/hero";
import Trending from "../components/trending";
import NewRelease from "../components/newRelease";
import Search from "../components/Search";
import Footer from "../components/footer";

const Home = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const isSearching = Boolean(query);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const { data: trendingMovies, isLoading } = useQuery<Movie[]>({
    queryKey: ["hero-trending"],
    queryFn: getMovie,
    enabled: !isSearching,
  });

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 80vh, anggap hero sudah tidak terlihat
      setIsHeroVisible(window.scrollY < window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide hanya jika hero masih terlihat
  useEffect(() => {
    if (!trendingMovies?.length || isSearching || !isHeroVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [trendingMovies, isSearching, currentIndex, isHeroVisible]);

  const firstMovie = trendingMovies?.[currentIndex];

  return (
    <>
      <Navbar />

      {isSearching && <Search query={query} />}

      {!isSearching && (
        <>
          {isLoading || !firstMovie ? (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
              Loading...
            </div>
          ) : (
            <>
              <Background data={firstMovie} />
              <Hero movie={firstMovie} />

              {/* Dots navigation - muncul hanya ketika hero visible */}
              {isHeroVisible && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-2 transition-opacity duration-300">
                  {trendingMovies?.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all hover:bg-white/80 ${
                        idx === currentIndex 
                          ? "w-8 bg-white" 
                          : "w-2 bg-white/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <Trending />
              <NewRelease />
            </>
          )}
        </>
      )}

      <Footer />
    </>
  );
};

export default Home;