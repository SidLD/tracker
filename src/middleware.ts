import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
 
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  if (request.nextUrl.pathname == '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: ['/', '/dashboard/:path*'],
}