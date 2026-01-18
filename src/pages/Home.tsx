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

  const { data: trendingMovies, isLoading } = useQuery<Movie[]>({
    queryKey: ["hero-trending"],
    queryFn: getMovie,
    enabled: !isSearching,
  });

  const firstMovie = trendingMovies?.[0];

  return (
    <>
      <Navbar />

      {/* ===== SEARCH MODE ===== */}
      {isSearching && <Search query={query} />}

      {/* ===== HOME MODE ===== */}
      {!isSearching && (
        <>
          {isLoading || !firstMovie ? (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
              Loading...
            </div>
          ) : (
            <>
              {/* HERO BACKGROUND */}
              <Background data={firstMovie} />
              <Hero movie={firstMovie} />

              {/* LIST SECTION */}
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