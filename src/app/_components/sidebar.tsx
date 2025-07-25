"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  CalendarIcon,
  PhotoIcon,
  UserGroupIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Events", href: "/events", icon: CalendarIcon },
  { name: "Gallery", href: "/gallery", icon: PhotoIcon },
  { name: "Executives", href: "/executives", icon: UserGroupIcon },
];

/**
 * Renders a responsive sidebar navigation component with theme toggling and authentication controls.
 *
 * The sidebar adapts its layout and content for desktop, tablet, and mobile viewports. It displays navigation links, a theme toggle button, and authentication actions (sign in/out) based on the user's session state. The component prevents hydration mismatches by rendering minimal placeholders until mounted.
 *
 * @returns The sidebar navigation UI as a React element.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>
        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-lg lg:transition-colors lg:dark:bg-gray-800">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                BTHS Action
              </h3>
            </div>
          </div>
        </div>

        {/* Tablet Icon Sidebar */}
        <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-16 md:bg-white md:shadow-lg md:transition-colors lg:hidden md:dark:bg-gray-800">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
              <div className="bg-default flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-sm font-bold text-white">BA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white md:hidden dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-around py-2">
            {/* Placeholder for mobile nav */}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Sidebar - Full width with text */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-lg lg:transition-colors lg:dark:bg-gray-800">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              BTHS Action
            </h3>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-default/10 dark:bg-default/20 text-default-darker dark:text-default-lighter"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-default dark:text-default-lighter"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* Theme Toggle Button */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {resolvedTheme === "dark" ? (
                <>
                  <SunIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <MoonIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
                  Dark Mode
                </>
              )}
            </button>
          </nav>

          {/* Auth Section */}
          <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
            {status === "loading" ? (
              <div className="flex w-full items-center justify-center px-3 py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-700 dark:border-gray-300"></div>
              </div>
            ) : session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2 text-sm">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="truncate text-gray-700 dark:text-gray-300">
                    {session.user.name ?? session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("auth0")}
                className="bg-default hover:bg-default-darker flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                Sign In
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              © 2025 BTHS Action
            </p>
          </div>
        </div>
      </div>

      {/* Tablet Icon Sidebar - Icons only */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-16 md:bg-white md:shadow-lg md:transition-colors lg:hidden md:dark:bg-gray-800">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <div className="bg-default flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-sm font-bold text-white">BA</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  className={`group flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-default/10 dark:bg-default/20 text-default-darker dark:text-default-lighter"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 ${
                      isActive
                        ? "text-default dark:text-default-lighter"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}

            {/* Theme Toggle Button */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              className="flex w-full items-center justify-center rounded-md p-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
              )}
            </button>
          </nav>

          {/* Auth Section */}
          <div className="border-t border-gray-200 px-2 py-4 dark:border-gray-700">
            {status === "loading" ? (
              <div className="flex w-full items-center justify-center p-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-700 dark:border-gray-300"></div>
              </div>
            ) : session?.user ? (
              <div className="space-y-2">
                <div
                  className="flex items-center justify-center p-2"
                  title={session.user.name ?? session.user.email ?? "User"}
                >
                  <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="flex w-full items-center justify-center rounded-md p-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("auth0")}
                title="Sign In"
                className="bg-default hover:bg-default-darker flex w-full items-center justify-center rounded-md p-2 text-sm font-medium text-white transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white md:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200 ${
                  isActive
                    ? "text-default dark:text-default-lighter"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-6 w-6 ${
                    isActive
                      ? "text-default dark:text-default-lighter"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  aria-hidden="true"
                />
                <span className="mt-1 text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Theme Toggle for Mobile */}
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex flex-col items-center justify-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {resolvedTheme === "dark" ? (
              <>
                <SunIcon className="h-6 w-6" />
                <span className="mt-1 text-xs font-medium">Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-6 w-6" />
                <span className="mt-1 text-xs font-medium">Dark</span>
              </>
            )}
          </button>

          {/* Auth for Mobile */}
          {status === "loading" ? (
            <div className="flex flex-col items-center justify-center p-2">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-600 dark:border-gray-400"></div>
              <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                ...
              </span>
            </div>
          ) : session?.user ? (
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center justify-center rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="mt-1 text-xs font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => signIn("auth0")}
              className="text-default dark:text-default-lighter hover:text-default-darker dark:hover:text-default flex flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="mt-1 text-xs font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
