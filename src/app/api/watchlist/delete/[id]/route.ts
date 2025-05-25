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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Användare saknas" }, { status: 404 });
  }

  // Kontrollera att watchlist-posten tillhör användaren
  const item = await prisma.watchlist.findUnique({
    where: { id: params.id },
  });

  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Ingen åtkomst" }, { status: 403 });
  }

  await prisma.watchlist.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
