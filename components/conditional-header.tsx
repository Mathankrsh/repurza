"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Check if current route is waitlist
  const isWaitlistRoute = pathname.startsWith("/waitlist");
  
  return (
    <>
      {!isWaitlistRoute && <Header />}
      {!isWaitlistRoute && <Footer />}
    </>
  );
}