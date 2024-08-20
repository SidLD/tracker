import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
 
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  if(!session){
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: '/dashboard',
}