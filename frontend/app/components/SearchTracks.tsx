"use client";

import { useState, Suspense } from "react";
import axios from 'axios';
import { InputWithButton } from "./InputWithButton";
import {useSession} from "next-auth/react";


const BACKEND_URL = "http://127.0.0.1:8000";

export default function SearchTracks({ initialTracks }: { initialTracks: string }) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  // const [combinedQuery, setCombinedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  async function searchTracks() {
    if (!query || query === "") {
      setTracks([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await axios.post(`${BACKEND_URL}/send-query-to-model`, { query });
      const emotion = res.data.emotion;
      console.log("emotions are", emotion);

      const combinedQuery = `${query} ${emotion}`;
      console.log("combined query is", combinedQuery);
    
      const spotifyRes = await axios.get(`/api/spotify/search`, {
        params: { query: combinedQuery }
      });
      setTracks(spotifyRes.data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-10 flex flex-col items-center w-full min-h-screen">
      {/* Welcome Section */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-400 text-lg">Discover music that matches your mood</p>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-2xl px-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <InputWithButton 
            value={query}
            onChange={(e) => setQuery(e.target.value)} 
            onClick={searchTracks}
            disabled={isLoading}>
            I want to feel like...
          </InputWithButton>
          
          {/* Placeholder Suggestions */}
          {!query && tracks.length === 0 && (
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-3">Try these mood suggestions:</p>
              <div className="flex flex-wrap gap-2">
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
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1.5 text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-full transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl px-4">
        <Suspense fallback={<div>Loading...</div>}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-gray-400">Finding the perfect songs for your mood...</p>
            </div>
          ) : (
            <TrackList tracks={tracks} />
          )}
        </Suspense>
      </div>
    </div>
  );
} 

function TrackList({tracks}: {tracks: any[]}) {
  if(!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No tracks found</h3>
        <p className="text-gray-500">Try another mood or check your search terms!</p>
      </div>
    );
  }
  
  return ( 
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Mood Playlist</h2>
        <span className="text-sm text-gray-400">{tracks.length} tracks found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {tracks.map((track: any) => (
          <div key={track.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/70 h-full flex flex-col">
            <div className="mb-3 flex-shrink-0">
              <h3 className="font-semibold text-white text-lg mb-1 line-clamp-2 group-hover:text-gray-100 transition-colors min-h-[3.5rem]">
                {track.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-1">
                {track.artists.map((artist: any) => artist.name).join(", ")}
              </p>
            </div>
            
            <div className="rounded-lg overflow-hidden flex-grow">
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="152"
                allow="encrypted-media"
                className="rounded-lg w-full"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



