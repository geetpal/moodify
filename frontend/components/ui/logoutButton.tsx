"use client";
import { Button } from "./button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
    return <Button variant="default" size="default" onClick={() => signOut({callbackUrl: "/"})}>Logout</Button>;
}
