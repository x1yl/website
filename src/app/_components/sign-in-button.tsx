"use client";

import { signIn } from "next-auth/react";

interface SignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Renders a button that initiates sign-in with Auth0 when clicked.
 *
 * Displays custom content if provided via `children`; otherwise, shows "Sign In".
 *
 * @param className - Optional CSS class for styling the button
 * @param children - Optional custom content to display inside the button
 */
export function SignInButton({ className, children }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn("auth0")}
      className={className}
    >
      {children || "Sign In"}
    </button>
  );
}
