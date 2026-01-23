import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS для всіх API роутів
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Дозволяємо запити з фронтенду
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://european-lyceum.pp.ua',       // Production domain
      'https://site.european-lyceum.pp.ua',  // Production site domain
      'https://www.european-lyceum.pp.ua',   // WWW variant
      // Development origins (only for local development)
      ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3003',
      ] : [])
    ];
    
    // Якщо origin дозволений, встановлюємо його та credentials
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (origin) {
      // Якщо origin є, але не в списку, все одно дозволяємо (для розробки)
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // Якщо немає origin (наприклад, прямий запит з браузера), дозволяємо всім
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Обробка preflight запитів (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: response.headers
      });
    }
    
    return response;
  }

  // Перенаправлення з кореня на /login (з basePath це буде /admin -> /admin/login)
  // With basePath, Next.js strips /admin from pathname, so '/' means /admin/
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '') {
    const loginUrl = new URL(request.url);
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  // Перевірка аутентифікації для адмін розділів (реальні URL без групи '(admin)')
  // З basePath: '/admin', Next.js автоматично видаляє префікс, тому перевіряємо без /admin
  const protectedPaths = [
    '/dashboard',
    '/visiting-card',
    '/business-card',
    '/school-history',
    '/innovation-activity',
    '/news-management',
    '/staff',
    '/staff/create',
    '/regulatory-documents',
    '/financial-reports',
    '/public-information',
    '/intellect-talent',
    '/student-government',
    '/project-research',
    '/patriotic-education',
    '/evaluation-criteria',
    '/clubs-studios',
    '/sport-life',
    '/social-psychological-support',
    '/anti-bullying',
    '/help-teacher',
    '/qualification-improvement',
    '/teacher-certification',
    '/methodological-events',
    '/for-parents',
    '/for-students',
    '/change-password',
    '/links',
    '/links/create',
  ];
  const isProtectedExplicit = protectedPaths.some((p) =>
    request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(`${p}/`)
  );
  // З basePath, всі шляхи вже без /admin префіксу
  const isProtected = isProtectedExplicit;
  if (isProtected) {
    const token = request.cookies.get('admin-token')?.value;
    // Debug logging
    console.log('🔐 Middleware: Checking protected path:', request.nextUrl.pathname);
    console.log('🔐 Middleware: admin-token present:', !!token);
    
    // Check token first - if valid token exists, allow access
    // recent-login is a short-term cookie for immediate post-login access
    // For ongoing sessions, we rely on the token validity
    if (!token) {
      console.log('❌ Middleware: No token, redirecting to login');
      const loginUrl = new URL(request.url);
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    console.log('✅ Middleware: Token found, allowing access');
    // Optional: verify token is valid (could add JWT verification here)
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',           // API роути
    '/admin',                // Admin маршрут
    '/admin/:path*',         // Всі підмаршрути /admin/*
    '/dashboard',            // Dashboard маршрут
    '/dashboard/:path*',     // Dashboard підмаршрути
    '/visiting-card',
    '/visiting-card/:path*',
    '/school-history',
    '/school-history/:path*',
    '/innovation-activity',
    '/innovation-activity/:path*',
    '/business-card',
    '/business-card/:path*',
    '/news-management',
    '/news-management/:path*',
    '/staff',
    '/staff/:path*',
    '/staff/create',
    '/regulatory-documents',
    '/regulatory-documents/:path*',
    '/financial-reports',
    '/financial-reports/:path*',
    '/public-information',
    '/public-information/:path*',
    '/intellect-talent',
    '/intellect-talent/:path*',
    '/student-government',
    '/student-government/:path*',
    '/project-research',
    '/project-research/:path*',
    '/patriotic-education',
    '/patriotic-education/:path*',
    '/evaluation-criteria',
    '/evaluation-criteria/:path*',
    '/clubs-studios',
    '/clubs-studios/:path*',
    '/sport-life',
    '/sport-life/:path*',
    '/social-psychological-support',
    '/social-psychological-support/:path*',
    '/anti-bullying',
    '/anti-bullying/:path*',
    '/help-teacher',
    '/help-teacher/:path*',
    '/qualification-improvement',
    '/qualification-improvement/:path*',
    '/teacher-certification',
    '/teacher-certification/:path*',
    '/methodological-events',
    '/methodological-events/:path*',
    '/for-parents',
    '/for-parents/:path*',
    '/for-students',
    '/for-students/:path*',
    '/change-password',
    '/change-password/:path*',
    '/links',
    '/links/:path*',
    '/links/create',
  ],
};
