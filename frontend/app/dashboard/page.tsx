import SearchTracks from "@/app/components/SearchTracks";
import {SessionProvider} from "next-auth/react";
import { SearchProvider } from "@/app/contexts/SearchContext";

export default async function Dashboard() {
  return (
    <SessionProvider>
      <SearchProvider>
        <div className="min-h-screen bg-black">
          <SearchTracks />
        </div>
      </SearchProvider>
    </SessionProvider>
  );
}