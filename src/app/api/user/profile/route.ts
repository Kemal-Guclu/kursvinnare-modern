import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Ej behörig", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true },
  });

  if (!user) {
    return new NextResponse("Användare ej hittad", { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Ej behörig", { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return new NextResponse("Ogiltigt namn", { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  return NextResponse.json(updated);
}
