import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovie } from "../services/tmdb";
import type { MovieResponse } from "../services/tmdb";
import MovieSearchCard from "./movieSearchCard";

type Props = {
  query: string;
};

const SearchResult = ({ query }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery<MovieResponse>({
    queryKey: ["search", query, page],
    queryFn: () => searchMovie(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  if (isLoading) {
    return (
      <div className="px-6 pt-32 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-white px-6 pt-32">Error loading search results</p>
    );
  }

  if (!data || data.results.length === 0) {
    return <p className="text-white text-center pt-32">😢 Movie not found</p>;
  }

  return (
    <div className="px-6 pt-32 max-w-6xl mx-auto">
      <h2 className="text-white text-xl mb-8">
        Search result for: <span className="text-red-500">{query}</span>
      </h2>

      {/* LIST */}
      <div className="flex flex-col gap-6">
        {data.results.map((movie) => (
          <MovieSearchCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-12">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
        >
          Prev
        </button>

        <span className="text-white text-sm">
          Page {data.page} of {data.total_pages}
        </span>

        <button
          disabled={page >= data.total_pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {isFetching && (
        <p className="text-center text-white/60 mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default SearchResult;
