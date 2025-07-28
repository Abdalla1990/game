import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get locale from environment variable or default to 'ar'
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'ar';

  // Set the locale header for next-intl
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);

  return response;
}

export const config = {
  // Match all paths except API routes and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
