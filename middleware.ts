import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = [ "/", '/api/tasks' ];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if ( isProtectedPath && !req.auth ) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matches : [ '/((?!_next/static|_next/image|favicon.ico).)*' ]
}