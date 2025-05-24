// src/app/api/watchlist/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Ej auktoriserad" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      watchlists: {
        include: { asset: true },
      },
    },
  });

  return NextResponse.json(user?.watchlists || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Ej auktoriserad" }, { status: 401 });
  }

  const { assetId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const existing = await prisma.watchlist.findFirst({
    where: { userId: user?.id, assetId },
  });

  if (existing) {
    return NextResponse.json({ error: "Redan i watchlist" }, { status: 400 });
  }

  const added = await prisma.watchlist.create({
    data: {
      userId: user!.id,
      assetId,
    },
  });

  return NextResponse.json(added);
}
