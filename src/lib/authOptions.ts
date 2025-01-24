// authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { useAuthStore } from "@/lib/auth";
import { NextAuthOptions } from "next-auth";
import { get, post } from "@/lib/apiUtils";
import { auth, profile } from "@/types/login/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Authenticate the user and get tokens
          const { access_token, refresh_token } = await post<auth>(
            "/auth/login",
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          );

          // Store tokens in the auth store
          useAuthStore.getState().setTokens(access_token, refresh_token);

          // Fetch the user profile
          const userProfile = await get<profile>("/auth/profile", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          // Convert the `id` to a string to match the `User` type
          return {
            ...userProfile,
            id: userProfile.id.toString(), // Convert `id` to a string
          };
        } catch (error) {
          console.error(error);
          return null; // Return null if authentication fails
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};
