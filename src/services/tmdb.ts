import { api } from "../lib/api";
import type { Movie } from "../types/movie";
import type { MovieDetail, MovieVideosResponse } from "../types/movieDetail";

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

type VideoResponse = {
  id: number;
  results: Video[];
};

// TRENDING MOVIES
export const getMovie = async (): Promise<Movie[]> => {
  const response = await api.get<MovieResponse>("/trending/movie/week");
  return response.data.results;
};

// NEW RELEASE (NOW PLAYING)
export const getNewRelease = async (): Promise<Movie[]> => {
  const response = await api.get<MovieResponse>("/movie/now_playing");
  return response.data.results;
};

// CAST & CREW
export const getMovieCredits = async (id: number) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

// SEARCH MOVIES (WITH PAGINATION)
export const searchMovie = async (
  query: string,
  page = 1
): Promise<MovieResponse> => {
  if (!query.trim()) {
    return {
      results: [],
      page: 1,
      total_pages: 0,
    };
  }

  const response = await api.get<MovieResponse>("/search/movie", {
    params: {
      query,
      page,
    },
  });

  return response.data;
};

// MOVIE DETAIL
export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

// MOVIE TRAILER (YOUTUBE)
export const getMovieTrailer = async (id: number): Promise<Video | undefined> => {
  const response = await api.get<VideoResponse>(`/movie/${id}/videos`);
  
  return response.data.results.find(
    (video: Video) => video.type === "Trailer" && video.site === "YouTube"
  );
};

// MOVIE VIDEOS
export const getMovieVideos = async (id: number): Promise<MovieVideosResponse> => {
  const response = await api.get<MovieVideosResponse>(`/movie/${id}/videos`);
  return response.data;
};