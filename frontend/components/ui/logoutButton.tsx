"use client";
import { Button } from "./button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <Button 
            variant="ghost" 
            size="default" 
            onClick={() => signOut({callbackUrl: "/"})}
            className="text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
            Logout
        </Button>
    );
}
