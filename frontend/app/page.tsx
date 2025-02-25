
import { SignInButton } from "@/components/ui/signinButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard"); 
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
     <SignInButton />
     This is the home page
    </div>
  );
}
