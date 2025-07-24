"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface NextAuthSessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function NextAuthSessionProvider({ 
  children, 
  session 
}: NextAuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
