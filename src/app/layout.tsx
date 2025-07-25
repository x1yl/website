import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Sidebar } from "~/app/_components/sidebar";
import { ThemeProvider } from "next-themes";
import { NextAuthSessionProvider } from "~/app/_components/session-provider";

export const metadata: Metadata = {
  title: "BTHS Action",
  description: "Brooklyn Technical High School Action club - Community service and engagement organization",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

/**
 * Defines the root layout for the application, applying global providers, theming, and the main page structure.
 *
 * Wraps all pages with theme, authentication, and tRPC providers, and includes a sidebar alongside the main content area.
 *
 * @param children - The content to render within the main layout area
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProvider 
          attribute="class" 
          storageKey="theme" 
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <NextAuthSessionProvider>
            <TRPCReactProvider>
              <div className="min-h-screen">
                <Sidebar />
                <main className="lg:ml-64 md:ml-16 mb-16 md:mb-0 bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen">
                  {children}
                </main>
              </div>
            </TRPCReactProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
