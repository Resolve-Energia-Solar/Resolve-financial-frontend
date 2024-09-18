import { NextResponse } from 'next/server';

export function middleware(request) {
  const acesstoken = request.cookies.get('access_token')?.value;

  console.log('Request URL:', request.nextUrl.pathname);
  console.log('Current User:', acesstoken);

  if (request.nextUrl.pathname.startsWith('/auth') && acesstoken) {
    if (request.nextUrl.pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!acesstoken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|gif)$).*)'
  ],
};



