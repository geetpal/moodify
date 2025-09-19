"use client";

import { useState, Suspense, useEffect } from "react";
import axios from 'axios';
import { InputWithButton } from "./InputWithButton";
import {useSession} from "next-auth/react";
import { useSearch } from "@/app/contexts/SearchContext";
import Footer from "./Footer";


const BACKEND_URL = process.env.BACKEND_URL;

export default function SearchTracks({ initialTracks }: { initialTracks: string }) {
  const { query, setQuery, tracks, setTracks, isLoading, searchTracks, error, clearError } = useSearch();
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  // Dynamic mood keywords
  const moodKeywords = [
    "dancing all night...",
    "flying through clouds...",
    "relaxing by the beach...",
    "pumping iron at the gym...",
    "driving on an open road...",
    "studying in a library...",
    "celebrating victory...",
    "meditating peacefully...",
    "exploring new places...",
    "dancing in the rain..."
  ];

  const baseText = "I want to feel like ";

  // Typing effect - only run if user hasn't searched yet
  useEffect(() => {
    if (hasSearched) return; // Stop dynamic placeholder after first search

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    let changeInterval: NodeJS.Timeout;

    const typeKeyword = (keyword: string) => {
      let i = 0;
      setDisplayText(baseText);
      setIsTyping(true);
      
      typingInterval = setInterval(() => {
        if (i < keyword.length) {
          setDisplayText(baseText + keyword.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 80); // Slightly slower for better readability
    };

    const changeKeyword = () => {
      setDynamicPlaceholder(baseText + moodKeywords[currentIndex]);
      typeKeyword(moodKeywords[currentIndex]);
      currentIndex = (currentIndex + 1) % moodKeywords.length;
    };

    // Start with first keyword
    changeKeyword();

    // Change keyword every 3.5 seconds (2.5s display + 1s typing)
    changeInterval = setInterval(changeKeyword, 3500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(changeInterval);
    };
  }, [hasSearched]);

  // Custom search function that tracks if user has searched
  const handleSearch = () => {
    setHasSearched(true);
    searchTracks();
  };

  // Static placeholder after first search
  const staticPlaceholder = "I want to feel like...";

  return (
    <div className="pt-32 flex flex-col items-center w-full min-h-screen">
      <div className="flex-1 flex flex-col items-center w-full">
      {/* Welcome Section */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight pb-2">
          Hey {session?.user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-gray-400 text-lg">Discover songs that put you in your desired mood</p>
      </div>

      {/* Search Section - Option 3: No Container */}
      <div className="w-full max-w-2xl px-4 mb-8">
        <InputWithButton 
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          onClick={handleSearch}
          disabled={isLoading}
          placeholder={hasSearched ? staticPlaceholder : displayText}
          onClear={() => setQuery('')}>
          {hasSearched ? staticPlaceholder : displayText}
        </InputWithButton>
        
        {!query && tracks.length === 0 && (
          <div className="mt-8">
            <p className="text-gray-300 text-base mb-4 font-medium text-center">Quick mood suggestions:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "flying through the clouds",
                "dancing all night",
                "relaxing by the beach",
                "pumping iron at the gym",
                "driving on an open road",
                "studying in a library"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(`I want to feel like ${suggestion}`)}
                  className="px-4 py-2 text-sm bg-gray-700/60 hover:bg-gray-600/60 text-gray-200 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl px-4 mb-16">
        <Suspense fallback={<div>Loading...</div>}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-gray-400">Finding the perfect songs for your mood...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => {
                  clearError();
                  searchTracks();
                }}
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          ) : (
            <TrackList tracks={tracks} hasSearched={query.length > 0} />
          )}
        </Suspense>
      </div>
      </div>
      
      <Footer />
    </div>
  );
} 

function TrackList({tracks, hasSearched}: {tracks: any[], hasSearched: boolean}) {
  if(!tracks || tracks.length === 0) {
    return null; // Don't show any empty state - let the search bar and suggestions speak for themselves
  }
  
  return ( 
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mood Matches</h2>
        <span className="text-sm text-gray-400">{tracks.length} tracks found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {tracks.map((track: any) => (
          <div key={track.id} className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20">
            <div className="rounded-xl overflow-hidden">
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="152"
                allow="encrypted-media"
                className="rounded-xl w-full"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



