// app/api/assets/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

// För POST-begäran: skapa asset (eller hämta om den redan finns)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, symbol, type } = body;

    if (!name || !symbol || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Försök hitta befintlig asset via symbol (unikt nu)
    let asset = await prisma.asset.findUnique({
      where: { symbol },
    });

    if (!asset) {
      const slug = slugify(name || symbol, { lower: true });

      asset = await prisma.asset.create({
        data: {
          name,
          symbol,
          type,
          slug,
        },
      });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Asset POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
