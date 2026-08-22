import { TMDB_API_URL, TMDB_API_KEY, TMDB_IMAGE_URL } from '../config';

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750/1A1A1A/FFFFFF?text=No+Image';
  return `${TMDB_IMAGE_URL}${size}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  if (!path) return 'https://via.placeholder.com/1280x720/1A1A1A/FFFFFF?text=No+Image';
  return `${TMDB_IMAGE_URL}original${path}`;
};

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  }).toString();
  const url = `${TMDB_API_URL}${endpoint}?${queryParams}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week') => {
  return fetchFromTMDB(`trending/movie/${timeWindow}`);
};

export const getNowPlayingMovies = async (page: number = 1) => {
  return fetchFromTMDB('movie/now_playing', { page: String(page) });
};

export const getUpcomingMovies = async (page: number = 1) => {
  return fetchFromTMDB('movie/upcoming', { page: String(page) });
};

export const getPopularMovies = async (page: number = 1) => {
  return fetchFromTMDB('movie/popular', { page: String(page) });
};

export const getTopRatedMovies = async (page: number = 1) => {
  return fetchFromTMDB('movie/top_rated', { page: String(page) });
};

export const searchMovies = async (query: string, page: number = 1) => {
  return fetchFromTMDB('search/movie', { query, page: String(page) });
};

export const getMovieDetails = async (movieId: number) => {
  return fetchFromTMDB(`movie/${movieId}`, { append_to_response: 'credits' });
};

export const getGenres = async () => {
  return fetchFromTMDB('genre/movie/list');
};

export const getMoviesByGenre = async (genreId: number, page: number = 1) => {
  return fetchFromTMDB('discover/movie', { with_genres: String(genreId), page: String(page) });
};

export const getMovieVideos = async (movieId: number) => {
  return fetchFromTMDB(`movie/${movieId}/videos`);
};

export const getMovieCredits = async (movieId: number) => {
  return fetchFromTMDB(`movie/${movieId}/credits`);
};