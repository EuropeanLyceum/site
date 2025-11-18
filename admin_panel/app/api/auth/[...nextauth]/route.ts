import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { authenticateUser, createToken } from "@/lib/auth";

function ensureSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET must be provided in environment variables");
  }
  return secret;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!username || !password) {
          console.warn("NEXTAUTH: Missing username or password");
          return null;
        }

        const user = await authenticateUser(username, password);
        if (!user) {
          console.warn("NEXTAUTH: Invalid credentials for username:", username);
          return null;
        }

        return {
          id: String(user.id),
          name: user.username,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: ensureSecret(),
  },
  secret: ensureSecret(),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppToken;

      if (user) {
        appToken.id = user.id;
        appToken.name = user.name;
        appToken.email = user.email;
        appToken.role = (user as UserWithRole).role;
        appToken.appToken = createToken({
          userId: Number(user.id),
          username: user.name ?? "",
          role: (user as UserWithRole).role ?? "admin",
        });
      }

      if (!appToken.id && appToken.sub) {
        appToken.id = appToken.sub;
      }

      return appToken;
    },
    async session({ session, token }) {
      const appToken = token as AppToken;
      const baseUser = session.user ?? { name: null, email: null, image: null };
      const enhancedSession: AppSession = {
        ...session,
        user: {
          ...baseUser,
          id: appToken.id ?? appToken.sub ?? "",
          name: (appToken.name ?? baseUser.name) ?? null,
          email: (appToken.email ?? baseUser.email) ?? null,
          role: appToken.role,
        },
        appToken: appToken.appToken,
      };

      return enhancedSession;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

type UserWithRole = { role?: string } & {
  id?: string;
  name?: string | null;
  email?: string | null;
};

type AppToken = JWT & {
  id?: string;
  role?: string;
  appToken?: string;
};

type AppSession = Session & {
  user: (Session["user"] & { id: string; role?: string }) | null;
  appToken?: string;
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
