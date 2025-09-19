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
    
    const res = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: query,
        type: "track",
      },
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (res.status !== 200) {
      throw new Error("Failed to fetch from Spotify");
    }

    const data = res.data;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Spotify API Error:", error.response?.data || error.message);
    return NextResponse.json({ 
      error: error.response?.data?.error?.message || error.message 
    }, { status: 500 });
  }
}
