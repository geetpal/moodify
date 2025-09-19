import { LogoutButton } from "@/components/ui/logoutButton";
import SearchTracks from "@/app/components/SearchTracks";
import {SessionProvider} from "next-auth/react";

export default async function Dashboard() {
  const initialTracks = "hello";

  return (
    <SessionProvider>
      <div className="min-h-screen bg-black">
        <SearchTracks initialTracks={initialTracks} />
      </div>
    </SessionProvider>
  );
}