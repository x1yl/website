"use client";

import { signIn } from "next-auth/react";

interface SignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

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
