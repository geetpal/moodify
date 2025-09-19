"use client";
import { Button } from "./button";
import { signIn } from "next-auth/react";
import SpotifyIcon from "@/components/icons/Spotify_icon";
export function SignInButton({children}: {children: React.ReactNode}) {
    return (
        <Button variant="default" size="lg" onClick={() => signIn("spotify", {callbackUrl: "/dashboard"})}>
            {children}
            <SpotifyIcon />
        </Button>
    )
}