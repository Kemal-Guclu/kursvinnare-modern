// src/app/api/watchlist/delete/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Ej auktoriserad" }, { status: 401 });
  }

  const deleted = await prisma.watchlist.delete({
    where: { id: params.id },
  });

  return NextResponse.json(deleted);
}
