import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Se till att du har prisma-instans i lib/prisma.ts
import { getServerSession } from "next-auth"; // Importera sessionen om du använder NextAuth.js

// Hämtar användardata från databasen baserat på sessionen
export async function GET() {
  // Ta bort req här
  const session = await getServerSession(); // Hämta användarsessionen
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Hämta användardata från databasen
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user); // Returnera användardata som JSON
}

// Uppdaterar användarens profil
export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json(); // Hämta den nya namn-data från PUT-förfrågan
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Uppdatera användarens profil i databasen
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  return NextResponse.json(user); // Returnera den uppdaterade användaren
}
