
import { SignInButton } from "@/components/ui/signinButton";
import { auth } from "@/auth";
import getServerSession from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard"); 
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
    <SignInButton>
     Log in with Spotify
    </SignInButton>
    </div>
  );
}
