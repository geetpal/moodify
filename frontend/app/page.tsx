import { SignInButton } from "@/components/ui/signinButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Footer from "./components/Footer";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard"); 
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="text-green-400">Mood</span>
              <span className="text-white">ify</span>
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
            Discover music that puts you in your desired mood
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Tell us how you want to feel and we&apos;ll find the perfect songs using AI-powered mood detection and Spotify&apos;s vast music library.
          </p>
          
          <div className="mb-12">
            <SignInButton>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Continue with Spotify
            </SignInButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">Hugging Face AI analyzes your mood</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-400 text-sm">Find songs that match your desired mood</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Instant</h3>
              <p className="text-gray-400 text-sm">Get your mood playlist in seconds</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
