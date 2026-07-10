import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req) {
  const token = req.cookies.get("token")?.value
  const url = req.nextUrl.clone()

  // ❌ Not logged in
  if (!token) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  try {
    // ✅ decode JWT
    const decoded = jwt.decode(token)
    const role = decoded?.role

    // 🔐 ADMIN routes
    if (url.pathname.startsWith("/admin") && role !== "ADMIN") {
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    // 🔐 TEACHER routes
    if (url.pathname.startsWith("/teacher") && role !== "TEACHER") {
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    // 🔐 STUDENT routes
    if (url.pathname.startsWith("/student") && role !== "STUDENT") {
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    // ✅ allowed
    return NextResponse.next()
  } catch (err) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*"
  ],
}