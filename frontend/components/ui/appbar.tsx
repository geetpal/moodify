"use client"
import { Button, buttonVariants } from "./button";
import { signIn, signOut } from "next-auth/react";
import { LogoutButton } from "./logoutButton";
import {usePathname} from "next/navigation";

export default function AppBar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  return (
    <div className="flex flex-row gap-4 p-4  justify-between items-center bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl">Moodify</h1>
      </div>

{isDashboard && (
  <div className="flex gap-4">
      {/* <Button variant="link" onClick={() => signIn("spotify", {callbackUrl: "/dashboard"})}>
        Sign up
      </Button> */}
      <LogoutButton />
      {/* <Button variant="default" size="lg" onClick={() => signOut({callbackUrl: "/"})}>
        Log out
      </Button> */}
      </div>
      )}
    </div>
  );
}