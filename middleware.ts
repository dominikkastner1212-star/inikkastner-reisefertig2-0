import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/reisen",
  "/packlisten",
  "/routenplaner",
  "/stellplaetze",
  "/fahrzeug",
  "/kosten"
];

export function middleware(request: NextRequest) {
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  const hasSession = Boolean(request.cookies.get("rf-access-token")?.value);

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/reisen/:path*", "/packlisten/:path*", "/routenplaner/:path*", "/stellplaetze/:path*", "/fahrzeug/:path*", "/kosten/:path*", "/login"]
};
