import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// En enkel slugifierare
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // ta bort accenter
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function POST(req: Request) {
  const { name, type, symbol } = await req.json();

  if (!name || !type || !symbol) {
    return NextResponse.json(
      { error: "Både name, type och symbol krävs" },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  try {
    const asset = await prisma.asset.upsert({
      where: { slug }, // ✅ använder slug som unikt fält
      update: {}, // om du vill uppdatera type etc, lägg till här
      create: {
        name,
        slug,
        type,
        symbol,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Fel vid asset upsert:", error);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
