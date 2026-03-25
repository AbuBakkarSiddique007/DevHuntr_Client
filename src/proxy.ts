import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // In development, server-side middleware cannot access cross-origin cookies from OnRender on localhost.
  // We rely on client-side authentication guards in DashboardLayout instead.
  
  /*
  const token = request.cookies.get('accessToken')?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
