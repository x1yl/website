import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Auth0Provider, { type Auth0Profile } from "next-auth/providers/auth0";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Auth0Provider({
      profile(profile: Auth0Profile) {
        return {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
        };
      },
      authorization: {
        params: {
          prompt: "login",
        },
      },
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer: process.env.AUTH_AUTH0_ISSUER!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (profile?.sub?.includes("discord")) {
        const s = profile.sub.split("|");
        const discordID = s[s.length - 1];
        const dUser = await db.user.findUnique({
          where: { discordID },
          select: { email: true },
        });
        if (!dUser) {
          return "/auth/invalid-discord";
        }
        user.email = dUser.email;
      }
      if (
        user.email?.endsWith("@nycstudents.net") ||
        user.email?.endsWith("@gmail.com") ||
        user.email?.endsWith("@schools.nyc.gov")
      )
        return true;

      return "/auth/invalid-email";
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
} satisfies NextAuthConfig;
