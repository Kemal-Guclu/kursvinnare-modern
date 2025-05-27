// app/api/assets/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // Kontrollera att typen är giltig
    const validTypes = ["crypto", "stock-se", "stock-us"];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Ogiltig eller saknad typ" },
        { status: 400 }
      );
    }

    // Hämta assets baserat på exakt typ
    const assets = await prisma.asset.findMany({
      where: { type },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Internt serverfel vid hämtning av assets" },
      { status: 500 }
    );
  }
}

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

const apiKey = req.headers.get("x-api-key");

if (!apiKey) {
  return NextResponse.json({ error: "API-nyckel saknas." }, { status: 500 });
}
