"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  searchTracks: () => void;
  isLoading: boolean;
  tracks: any[];
  setTracks: (tracks: any[]) => void;
  error: string | null;
  clearError: () => void;
  clearAll: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchTracks = async () => {
    if (!query.trim()) {
      setTracks([]);
      setError(null);
      return;
    }
    
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // First, get emotions from backend
      const emotionResponse = await fetch(`${process.env.BACKEND_URL}/send-query-to-model`, {
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
      console.log("emotions are", emotion);

      // Combine query with emotions (join array with spaces)
      const emotionString = Array.isArray(emotion) ? emotion.join(' ') : emotion;
      const combinedQuery = `${query} ${emotionString}`;
      console.log("combined query is", combinedQuery);

      // Then search Spotify
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
      console.error('Error fetching tracks:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setTracks([]); // Clear tracks on error
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  
  const clearAll = () => {
    setQuery('');
    setTracks([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, searchTracks, isLoading, tracks, setTracks, error, clearError, clearAll }}>
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
