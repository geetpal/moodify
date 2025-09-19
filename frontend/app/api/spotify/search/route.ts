import { NextResponse } from "next/server";
import { auth } from "@/auth"; 
import axios from "axios";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query"); 

  if (!query) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    console.log("Searching Spotify with query:", query);
    console.log("Access token exists:", !!session.accessToken);
    console.log("Access token preview:", session.accessToken?.substring(0, 10) + "...");
    
    const res = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: query,
        type: "track",
        limit: 20
      },
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log("Spotify response status:", res.status);
    console.log("Spotify response data keys:", Object.keys(res.data));

    if (res.status !== 200) {
      throw new Error("Failed to fetch from Spotify");
    }

    const data = res.data;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Spotify API Error Details:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Error Message:", error.message);
    
    // Check if it's a token expiration issue
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        error: "Spotify session expired. Please sign in again." 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: error.response?.data?.error?.message || error.message || "Failed to search Spotify"
    }, { status: 500 });
  }
}
