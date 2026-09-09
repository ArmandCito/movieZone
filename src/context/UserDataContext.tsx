import React, { createContext, useContext, useMemo, useState } from 'react';

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface Booking {
  id: string;
  movieId: number;
  movieTitle: string;
  poster_path: string | null;
  date: string;
  weekday: string;
  time: string;
  location: string;
  seats: string[];
  total: number;
  createdAt: string;
}

export interface ContinueWatchingItem {
  movieId: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  progressSeconds: number;
  updatedAt: string;
}

interface UserDataContextType {
  favorites: FavoriteMovie[];
  bookings: Booking[];
  continueWatching: ContinueWatchingItem[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (id: number) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  saveWatchProgress: (item: Omit<ContinueWatchingItem, 'updatedAt'>) => void;
  clearWatchProgress: (movieId: number) => void;
  favoriteCount: number;
  bookingCount: number;
}

const UserDataContext = createContext<UserDataContextType>({
  favorites: [],
  bookings: [],
  continueWatching: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  removeFavorite: () => {},
  addBooking: () => ({ id: '', movieId: 0, movieTitle: '', poster_path: null, date: '', weekday: '', time: '', location: '', seats: [], total: 0, createdAt: '' }),
  cancelBooking: () => {},
  saveWatchProgress: () => {},
  clearWatchProgress: () => {},
  favoriteCount: 0,
  bookingCount: 0,
});

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  const isFavorite = (id: number) => favorites.some((m) => m.id === id);

  const toggleFavorite = (movie: FavoriteMovie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [movie, ...prev]
    );
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const saveWatchProgress = (item: Omit<ContinueWatchingItem, 'updatedAt'>) => {
    // Only save meaningful progress (between 5 seconds and not finished).
    if (!item.progressSeconds || item.progressSeconds < 5) return;
    setContinueWatching((prev) => {
      const existing = prev.find((c) => c.movieId === item.movieId);
      if (existing) {
        return [
          { ...item, updatedAt: new Date().toISOString() },
          ...prev.filter((c) => c.movieId !== item.movieId),
        ];
      }
      return [{ ...item, updatedAt: new Date().toISOString() }, ...prev];
    });
  };

  const clearWatchProgress = (movieId: number) => {
    setContinueWatching((prev) => prev.filter((c) => c.movieId !== movieId));
  };

  const value = useMemo(
    () => ({
      favorites,
      bookings,
      continueWatching,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      addBooking,
      cancelBooking,
      saveWatchProgress,
      clearWatchProgress,
      favoriteCount: favorites.length,
      bookingCount: bookings.length,
    }),
    [favorites, bookings, continueWatching]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};