"use client";

import { useState } from "react";
import axios from 'axios';

export default function SearchTracks({ initialTracks }: { initialTracks: string }) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [combinedQuery, setCombinedQuery] = useState("");

  async function searchTracks() {
    if (!query || query === "") {
      setTracks([]);
      return;
    }
    // forward the query to the pythonbackend
    try {
      const res = await axios.post(`http://127.0.0.1:8000/send-query-to-model`, { query });
      const emotion = res.data.emotion;
      console.log("emotions are", emotion);
      setCombinedQuery(`${query} ${emotion}`);
      console.log("combined query is", combinedQuery);
    } catch (error) {
      console.error("Error sending user query to model:", error);
    }

    // send the combined query to the spotify api
    try {
      const res = await axios.get(`/api/spotify/search`, {
        params: { query: combinedQuery }
      });
      setTracks(res.data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Spotify Track Search</h1>
      <div className="flex gap-2" style={{ display: 'flex' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song"
          className="border p-2 rounded-md w-full"
        />
        <button onClick={searchTracks} className="bg-green-500 text-white p-2 rounded-md ">
          Search
        </button>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4">
        {tracks.map((track: any) => (
          <div key={track.id} className="shadow-lg p-4 rounded-lg bg-gray-900">
            {/* <h2 className="font-semibold text-white">{track.name}</h2>
            <p className="text-gray-500">
              {track.artists.map((artist: any) => artist.name).join(", ")}
            </p> */}
            <iframe
              src={`https://open.spotify.com/embed/track/${track.id}`}
              width="100%"
              height="80"
              allow="encrypted-media"
              className="mt-2 rounded-lg"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
} 