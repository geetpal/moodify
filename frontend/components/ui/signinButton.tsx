"use client";
import { Button } from "./button";
import { signIn } from "next-auth/react";
export function SignInButton({children}: {children: React.ReactNode}) {
    return (
        <Button variant="spotify" size="lg" onClick={() => signIn("spotify", {callbackUrl: "/dashboard"})}>
            {children}
        </Button>
    )
}