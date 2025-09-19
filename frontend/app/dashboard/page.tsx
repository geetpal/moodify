import { LogoutButton } from "@/components/ui/logoutButton";
import SearchTracks from "@/app/components/SearchTracks";
import {SessionProvider} from "next-auth/react";

export default async function Dashboard() {

  const initialTracks = "hello";

  return (
    <SessionProvider>
    <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden">
      <SearchTracks initialTracks={initialTracks} />
    </div>
    </SessionProvider>
  );
}