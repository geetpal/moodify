import { LogoutButton } from "@/components/ui/logoutButton";
import SearchTracks from "@/app/components/SearchTracks";
import axios from 'axios';

export default async function Dashboard() {

  const initialTracks = "hello";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <LogoutButton />
      <SearchTracks initialTracks={initialTracks} />
    </div>
  );
}