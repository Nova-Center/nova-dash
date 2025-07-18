import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/axios";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      username: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    username: string;
    token: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await api.post("/api/v1/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const userCredentials = res.data;

          if (!userCredentials) {
            throw new Error("No user data received");
          }

          if (!userCredentials.token) {
            throw new Error("Missing authentication token");
          }

          if (
            userCredentials.role !== "admin" &&
            userCredentials.role !== "superadmin"
          ) {
            throw new Error(
              "You are not authorized to access this application"
            );
          }

          return {
            id: String(userCredentials.id),
            email: userCredentials.email,
            username: userCredentials.username,
            token: userCredentials.token,
          };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Une erreur est survenue lors de la connexion";

          if (process.env.NODE_ENV === "development") {
            console.error("Erreur de connexion:", {
              message: errorMessage,
              status: error.response?.status,
              data: error.response?.data,
              error: error,
            });
          }

          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
