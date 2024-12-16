import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { getUser } from "@/repositories/users/queries/getUSerQuery";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Define a Zod schema for credentials validation
const credentialsSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

// Authentication configuration object
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Parse credentials
          const parsedCredentials = credentialsSchema.safeParse({
            username: credentials?.username,
            password: credentials?.password,
          });

          // Check if parsing was successful
          if (parsedCredentials.success) {
            const { username, password } = parsedCredentials.data;

            // User query
            const usersQuery = new getUser();
            const user = await usersQuery.execute(username);

            // Validate user exists
            if (!user) {
              console.error("User not found", username);
              return null;
            }

            // Validate if password matches
            const passwordsMatch = await bcrypt.compare(
              password,
              user.Password,
            );

            if (passwordsMatch) {
              // Return user object with required fields
              return {
                id: user.UserId.toString(),
                name: user.UserName,
                // email: user.Email || null, // Add email if available
              };
            } else {
              console.error("Password does not match");
              return null;
            }
          }

          console.error("Credentials validation failed");
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Authorization check for route protection
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/login";

      // Redirect to login if not logged in and not already on the login page
      if (!isLoggedIn && !isOnLogin) {
        return Response.redirect(new URL("/login", nextUrl.origin));
      }

      // Redirect to home if logged in and on login page
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL("/", nextUrl.origin));
      }

      return true;
    },

    // JWT callback to add custom fields to token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    // Session callback to add custom fields to session
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  // Session and security configuration
  jwt: {
    // Explicitly set maxAge for JWT
    maxAge: Number(process.env.SESSION_MAX_AGE), // 1 day
  },
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.SESSION_MAX_AGE), // 1 day
  },

  // Use environment secret for added security
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

// Export NextAuth with the combined configuration
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
