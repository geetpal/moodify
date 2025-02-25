"use client"
import { Button } from "./button";
import { signIn, signOut } from "next-auth/react";

export function AppBar() {
  return (
    <div className="flex flex-row gap-4">
      <Button onClick={() => signIn("spotify", {callbackUrl: "/dashboard"})}>
        Sign In
      </Button>
      <Button onClick={() => signOut({callbackUrl: "/"})}>
        Log out
      </Button>
    </div>
  );
}