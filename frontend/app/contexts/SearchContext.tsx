"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  searchTracks: () => void;
  isLoading: boolean;
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
  error: string | null;
  clearError: () => void;
  clearAll: () => void;
  emptyInputMessage: string | null;
  clearEmptyInputMessage: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [emptyInputMessage, setEmptyInputMessage] = useState<string | null>(null);

  const searchTracks = async () => {
    if (!query.trim()) {
      setTracks([]);
      setEmptyInputMessage('Enter a mood or choose from suggestions');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const emotionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-query-to-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!emotionResponse.ok) {
        throw new Error('Failed to analyze mood. Please try again.');
      }
      
      const emotionData = await emotionResponse.json();
      const emotion = emotionData.emotion;

      const emotionString = Array.isArray(emotion) ? emotion.join(' ') : emotion;
      const combinedQuery = `${query} ${emotionString}`;

      const spotifyResponse = await fetch(`/api/spotify/search?query=${encodeURIComponent(combinedQuery)}`);
      
      if (!spotifyResponse.ok) {
        if (spotifyResponse.status === 401) {
          throw new Error('Spotify session expired. Please sign in again.');
        }
        throw new Error('Failed to search Spotify. Please check your connection and try again.');
      }
      
      const spotifyData = await spotifyResponse.json();
      setTracks(spotifyData.tracks?.items || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearEmptyInputMessage = () => setEmptyInputMessage(null);
  
  const clearAll = () => {
    setQuery('');
    setTracks([]);
    setError(null);
    setEmptyInputMessage(null);
    setIsLoading(false);
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, searchTracks, isLoading, tracks, setTracks, error, clearError, clearAll, emptyInputMessage, clearEmptyInputMessage }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
