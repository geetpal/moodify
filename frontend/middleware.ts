
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
 
import { auth } from "@/auth";
export async function middleware(request: NextRequest) {
  const session = await auth();
  const token = session?.accessToken;
  const { pathname } = request.nextUrl;
  console.log(pathname);

  if(token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
