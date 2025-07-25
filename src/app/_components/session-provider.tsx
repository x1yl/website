"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface NextAuthSessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * Provides NextAuth session context to its child components.
 *
 * Wraps children with the NextAuth `SessionProvider`, optionally supplying a session object.
 *
 * @param children - React nodes to be rendered within the session context
 * @param session - Optional session object to initialize the provider
 */
export function NextAuthSessionProvider({
  children,
  session,
}: NextAuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
