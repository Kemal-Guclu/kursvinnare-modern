// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-post och lösenord krävs" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Användaren finns redan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ message: "Användare skapad" });
  } catch (error) {
    console.error("Fel vid registrering:", error);
    return NextResponse.json(
      { message: "Serverfel, försök igen senare" },
      { status: 500 }
    );
  }
}
