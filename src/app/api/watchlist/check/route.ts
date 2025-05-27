import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Justera sökvägen till din auth-konfig
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Hämta sessionen för aktuell användare
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
    }

    // Läs slug från query string
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug saknas" }, { status: 400 });
    }

    // Hämta asset med denna slug
    const asset = await prisma.asset.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!asset) {
      return NextResponse.json({ exists: false });
    }

    // Kolla om användarens watchlist innehåller assetId
    const watchlistEntry = await prisma.watchlist.findFirst({
      where: {
        user: { email: session.user.email },
        assetId: asset.id,
      },
    });

    return NextResponse.json({ exists: !!watchlistEntry });
  } catch (error) {
    console.error("API /watchlist/check error:", error);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
