import { NextResponse } from 'next/server';

export function middleware(request) {
  const currentUser = request.cookies.get('currentUser')?.value;

  console.log('Request URL:', request.nextUrl.pathname);
  console.log('Current User:', currentUser);

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  if (currentUser && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!currentUser) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)'
  ],
};

