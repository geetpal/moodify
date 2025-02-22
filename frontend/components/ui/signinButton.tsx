"use client";
import { Button } from "./button";
import { signIn } from "next-auth/react";

export function SignInButton() {
    return (
        <Button onClick={() => signIn("spotify", {callbackUrl: "/dashboard"})}>
            Sign In
        </Button>
    )
}