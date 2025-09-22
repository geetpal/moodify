"use client";

import { useState, Suspense, useEffect } from "react";
import { InputWithButton } from "./InputWithButton";
import {useSession} from "next-auth/react";
import { useSearch } from "@/app/contexts/SearchContext";
import Footer from "./Footer";

export default function SearchTracks() {
  const { query, setQuery, tracks, isLoading, searchTracks, error, clearError, emptyInputMessage, clearEmptyInputMessage } = useSearch();
  const [displayText, setDisplayText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { data: session } = useSession();

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

  useEffect(() => {
    if (hasSearched) return;

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    let changeInterval: NodeJS.Timeout;

    const typeKeyword = (keyword: string) => {
      let i = 0;
      setDisplayText(baseText);
      
      typingInterval = setInterval(() => {
        if (i < keyword.length) {
          setDisplayText(baseText + keyword.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);
    };

    const changeKeyword = () => {
      typeKeyword(moodKeywords[currentIndex]);
      currentIndex = (currentIndex + 1) % moodKeywords.length;
    };

    changeKeyword();
    changeInterval = setInterval(changeKeyword, 3500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(changeInterval);
    };
  }, [hasSearched, moodKeywords]);

  useEffect(() => {
    if (query.trim() && emptyInputMessage) {
      clearEmptyInputMessage();
    }
  }, [query, emptyInputMessage, clearEmptyInputMessage]);

  const handleSearch = () => {
    setHasSearched(true);
    searchTracks();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim() && emptyInputMessage) {
      clearEmptyInputMessage();
    }
  };

  const staticPlaceholder = "I want to feel like...";

  return (
    <div className="pt-32 flex flex-col items-center w-full min-h-screen">
      <div className="flex-1 flex flex-col items-center w-full">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight pb-2">
          Hey {session?.user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-gray-400 text-lg">Discover songs that put you in your desired mood</p>
      </div>
      <div className="w-full max-w-2xl px-4 mb-8">
        <InputWithButton 
          value={query}
          onChange={handleInputChange} 
          onClick={handleSearch}
          disabled={isLoading}
          placeholder={hasSearched ? staticPlaceholder : displayText}
          onClear={() => setQuery('')}>
          {hasSearched ? staticPlaceholder : displayText}
        </InputWithButton>
        
        {emptyInputMessage && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">{emptyInputMessage}</p>
          </div>
        )}
        
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
            <TrackList tracks={tracks} />
          )}
        </Suspense>
      </div>
      </div>
      
      <Footer />
    </div>
  );
} 

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

function TrackList({tracks}: {tracks: Track[]}) {
  if(!tracks || tracks.length === 0) {
    return null;
  }
  
  return ( 
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mood Matches</h2>
        <span className="text-sm text-gray-400">{tracks.length} tracks found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {tracks.map((track: Track) => (
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



