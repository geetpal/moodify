"use client"
import { Button, buttonVariants } from "./button";
import { signIn, signOut } from "next-auth/react";
import { LogoutButton } from "./logoutButton";
import {usePathname} from "next/navigation";

export default function AppBar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  return (
    <div className="fixed top-4 left-2 right-2 z-50 mx-auto max-w-7xl">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-row gap-4 justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight lg:text-4xl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              <span className="text-green-400">Mood</span>ify
            </h1>
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