// auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Notice this is now a simple object, not wrapped in NextAuth()
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHub,
    Google({

      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!

    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (
          !user ||
          !user.hashedPassword ||
          !bcrypt.compareSync(credentials.password as string, user.hashedPassword)
        ) {
          return null;
        }

        return user;
      },
    }),
  ],
callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const publicOnlyPaths = ["/login", "/register"];
      const isPublicOnlyPath = publicOnlyPaths.includes(path);

      // Allow access to auth API routes unconditionally
      if (path.startsWith("/api/auth")) {
        return true;
      }

      if (isLoggedIn) {
        // If a logged-in user tries to access a public-only page (login/register),
        // redirect them to the homepage.
        if (isPublicOnlyPath) {
          return Response.redirect(new URL("/", nextUrl));
        }
        // Logged-in users can access any other page
        return true;
      }

      // If a user is not logged in
      const publicPaths = ["/", ...publicOnlyPaths];
      const isPublicPath = publicPaths.includes(path);
      const isAsset = path.startsWith("/moments.svg"); // Allow logo to be public

      // Allow access to public pages and assets
      if (isPublicPath || isAsset) {
        return true;
      }

      // For any other path, the user is not authorized, which will
      // trigger a redirect to the login page.
      return false;
    },
    // Keep your other callbacks if you have them, e.g., jwt, session
  },
} satisfies NextAuthConfig;
