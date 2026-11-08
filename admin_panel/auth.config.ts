// @/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    // Важливо для твого basePath
    basePath: "/api/auth",
    trustHost: true,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 24 * 60 * 60
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isLoginPage = nextUrl.pathname.includes("/login");

            if (!isLoggedIn && !isLoginPage) return false; // Редірект на логін
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    providers: [], // Провайдери додамо в основному файлі
} satisfies NextAuthConfig;