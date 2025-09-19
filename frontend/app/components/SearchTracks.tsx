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
    <div className="pt-20 pb-10 flex flex-col items-center w-full h-auto overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-400">Hello {session?.user?.name}</h1>
    <div className="sticky top-[0px] w-1/2 z-10 bg-black pt-4 pb-6 flex justify-center">
      <InputWithButton 
        onChange={(e) => setQuery(e.target.value)} 
        onClick={searchTracks}
        disabled={isLoading}>
        I want to feel like...
      </InputWithButton>
      </div>
      <div className="mt-6 w-1/2  pr-2">
      <Suspense fallback = {<div>Loading...</div>}>
      {isLoading ? (<div>Loading...</div>):(
        <TrackList tracks={tracks}/>
      )}
        </Suspense> 
      </div>
    </div>
  );
} 

function TrackList({tracks}: {tracks: any[]}) {
  if(!tracks || tracks.length === 0) {
    return <div className="text-gray-500">No tracks found. Try another mood!</div>;
  }
  return ( 
        <div className="grid grid-cols-1 gap-4">
          {tracks.map((track: any) => (
            <div key={track.id} className="shadow-lg p-4 rounded-lg bg-gray-900">
              <h2 className="font-semibold text-white">{track.name}</h2>
              <p className="text-gray-500">
                {track.artists.map((artist: any) => artist.name).join(", ")}
              </p>
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="100%"
                allow="encrypted-media"
                className="mt-2 rounded-lg"
              ></iframe>
            </div>
          ))}
        </div>
  );
}



