import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next(); // middleware kan också modifiera response om du vill
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Endast inloggade släpps igenom
    },
    pages: {
      signIn: "/login", // ✅ Skicka obehöriga användare till /login
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"], // Skydda dashboard och dess undersidor
};
