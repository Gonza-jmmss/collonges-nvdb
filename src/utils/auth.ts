import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import getUserByUserNameQuery from "@/repositories/users/queries/getUserByUserNameQuery";
import getAllRoleModuleElementsByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllRoleModuleElementsByRoleIdQuery";
import { CustomUser } from "@/types/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Extend the User type in next-auth
declare module "next-auth" {
  interface User extends CustomUser {}

  interface Session {
    user: CustomUser;
  }
}

// Extend the JWT type in next-auth/jwt
declare module "next-auth/jwt" {
  interface JWT {
    user: CustomUser;
  }
}

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
            const user = await getUserByUserNameQuery(username);

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
              const roleModules = await getAllRoleModuleElementsByRoleIdQuery(
                user.RoleId,
              );

              // Return user object with required fields
              return {
                id: user.UserId.toString(),
                name: user.UserName,
                email: null, // Add required AdapterUser fields
                emailVerified: null,
                userData: user, // Full user data
                roleModules: roleModules, // Role modules data
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
  // cookies: {
  //   sessionToken: {
  //     name: "next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //       domain: process.env.COOKIE_DOMAIN || undefined,
  //       // domain:
  //       //   process.env.NODE_ENV === "production"
  //       //     ? process.env.COOKIE_DOMAIN
  //       //     : undefined,
  //     },
  //   },
  // },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
        domain: process.env.COOKIE_DOMAIN || undefined,
      },
    },
  },
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

      if (isLoggedIn && auth.user) {
        try {
          // Ensure userData exists before accessing it
          if (!auth.user.userData || !auth.user.roleModules) {
            console.error("Missing user data or role modules");
            return Response.redirect(new URL("/login", nextUrl.origin));
          }

          // const userRole = auth.user;
          const path = nextUrl.pathname;

          // get path without last "/create" or "/(any number)"
          const extractBasePath = (path: string) => {
            const match = path.match(/^(.*?)(\/(?:create|edit|\d+))$/);
            return match ? match[1] : path;
          };

          const hasPermission = auth.user.roleModules.some(
            (element) =>
              element.RoleId === auth.user.userData.RoleId &&
              element.Path === extractBasePath(path),
          );

          if (!hasPermission) {
            console.log("Access denied for path:", path);
            return Response.redirect(new URL("/", nextUrl.origin));
          }

          console.log("Access granted for path:", path);
          return true;
        } catch (error) {
          console.error("Error checking permissions:", error);
          // On error, redirect to error page or home
          return Response.redirect(new URL("/error", nextUrl.origin));
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: user.id || "",
          name: user.name || null,
          email: user.email || "",
          emailVerified: user.emailVerified,
          userData: user.userData,
          roleModules: user.roleModules,
        };
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.user = { ...token.user, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && token.user) {
        session.user = {
          ...token.user,
          id: token.user.id || "",
          name: token.user.name || null,
          email: token.user.email || "",
          emailVerified: token.user.emailVerified || null,
          userData: token.user.userData,
          roleModules: token.user.roleModules,
        };
      }
      return session;
    },
  },
  trustHost: true,

  // Session and security configuration
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.SESSION_MAX_AGE) || 36000,
    updateAge: 300, // Force session update every 5 minutes
  },

  // Use environment secret for added security
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

// Export NextAuth with the combined configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
});
