"use client";

import { usePathname } from "next/navigation";
import AppBar from "@/components/ui/appbar";

export default function ConditionalAppBar() {
  const pathname = usePathname();
  
  if (pathname === "/") {
    return null;
  }
  
  return <AppBar />;
}
