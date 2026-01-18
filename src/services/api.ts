import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const movieAPI = {
  getPopular: (page: number = 1) => 
    api.get('/movie/popular', { params: { page } }),
  
  getNowPlaying: () => 
    api.get('/movie/now_playing'),
  
  getDetail: (id: number) => 
    api.get(`/movie/${id}`),
  
  search: (query: string) => 
    api.get('/search/movie', { params: { query } }),
};

export const getImageUrl = (path: string | null, size: string = 'original'): string => {
  if (!path) return '/placeholder.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};