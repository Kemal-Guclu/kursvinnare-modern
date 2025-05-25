// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Ej auktoriserad" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Ingen e-post" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  return NextResponse.json({ name: user?.name || "" });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Ej auktoriserad" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Ingen e-post" }, { status: 400 });
  }

  const { name } = await req.json();

  await prisma.user.update({
    where: { email: userEmail },
    data: { name },
  });

  return NextResponse.json({ message: "Namn uppdaterat" });
}
