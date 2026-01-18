import { useQuery } from '@tanstack/react-query';
import { movieAPI } from '../services/api';
import type { Movie } from '../types/movie';

export const usePopularMovies = (page: number = 1) => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'popular', page],
    queryFn: async () => {
      const { data } = await movieAPI.getPopular(page);
      return data.results || [];
    },
  });
};

export const useNowPlaying = () => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: async () => {
      const { data } = await movieAPI.getNowPlaying();
      return data.results || [];
    },
  });
};

export const useMovieDetail = (id: number) => {
  return useQuery<Movie, Error>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data } = await movieAPI.getDetail(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery<Movie[], Error>({
    queryKey: ['movies', 'search', query],
    queryFn: async () => {
      const { data } = await movieAPI.search(query);
      return data.results || [];
    },
    enabled: !!query && query.length > 2,
  });
};