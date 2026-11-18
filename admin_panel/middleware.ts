// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Ініціалізуємо auth спеціально для Middleware (Edge compatible)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, method, headers } = req;
  const isLoggedIn = !!req.auth;

  // 1. --- CORS ---
  if (nextUrl.pathname.startsWith('/admin/api/')) {
    const origin = headers.get('origin');
    const allowedOrigins = [
      'https://european-lyceum.pp.ua',
      'https://site.european-lyceum.pp.ua',
      'https://www.european-lyceum.pp.ua',
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'] : [])
    ];

    const response = NextResponse.next();

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
    return response;
  }

  // 2. --- ЛОГІКА ЗАХИСТУ СТОРІНОК ---
  const isLoginPage = nextUrl.pathname.includes("/login");

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};