export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  backdrop_path: string;
  genres?: Genre[];
  age?: string;
  // Add these additional properties that TMDB provides
  tagline?: string;
  status?: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  homepage?: string;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path?: string;
    origin_country: string;
  }>;
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages?: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
}

export type MovieCreditsResponse = {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
    order: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
    department?: string;
    profile_path: string | null;
  }>;
};

export type MovieVideosResponse = {
  id: number;
  results: Array<{
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
  }>;
};

// Enhanced image URL function with configurable size
export function getTmdbImageUrl(
  path: string | null, 
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "original"
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Your existing functions (they're good as-is)
export function formatRuntime(runtime?: number): string {
  if (!runtime || runtime <= 0) return "-";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatReleaseDate(date?: string): string {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB");
}

export function formatReleaseDateLongId(date?: string): string {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Additional utility functions you might find useful
export function formatCurrency(amount?: number): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getYearFromDate(date?: string): string {
  if (!date) return "-";
  return new Date(date).getFullYear().toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}