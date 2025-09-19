"use client"
import { Button, buttonVariants } from "./button";
import { signIn, signOut } from "next-auth/react";
import { LogoutButton } from "./logoutButton";
import {usePathname, useRouter} from "next/navigation";
import { useSearch } from "@/app/contexts/SearchContext";

export default function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAll } = useSearch();
  const isDashboard = pathname?.startsWith("/dashboard");
  
  return (
    <div className="fixed top-4 left-2 right-2 z-50 mx-auto max-w-7xl">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-full pl-6 pr-2 py-2 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-row gap-4 justify-between items-center">
          <div>
            <button 
              onClick={() => {
                clearAll();
                window.location.href = '/dashboard';
              }}
              className="text-2xl font-bold text-white tracking-tight hover:text-green-400 transition-colors duration-200 cursor-pointer"
              style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}
            >
              <span className="text-green-400">Mood</span>ify
            </button>
          </div>

          {isDashboard && (
            <div className="flex gap-4">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}