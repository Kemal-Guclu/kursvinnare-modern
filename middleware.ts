// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Lista på offentliga vägar som inte kräver autentisering
const publicRoutes = [
  "/",
  "/om",
  "/kontakt",
  "/api/public", // exempel på publik API-rutt
];

// Middleware-funktion med withAuth från next-auth
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Tillåt offentliga sidor
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Annars: autentisering krävs (sköts av withAuth)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // true = tillåt endast om JWT-token finns
        return !!token;
      },
    },
  }
);

// Konfiguration: vilka rutter ska kontrolleras av middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Lägg till fler skyddade sidor här om du vill
  ],
};
