import { LogoutButton } from "@/components/ui/logoutButton";
import SearchTracks from "@/app/components/SearchTracks";
import {SessionProvider} from "next-auth/react";
import { SearchProvider } from "@/app/contexts/SearchContext";

export default async function Dashboard() {
  const initialTracks = "hello";

  return (
    <SessionProvider>
      <SearchProvider>
        <div className="min-h-screen bg-black">
          <SearchTracks initialTracks={initialTracks} />
        </div>
      </SearchProvider>
    </SessionProvider>
  );
}