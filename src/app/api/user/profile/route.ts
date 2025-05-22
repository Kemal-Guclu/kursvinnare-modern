// src/pages/api/user/profile.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Ej auktoriserad" });

  const userEmail = session.user?.email;
  if (!userEmail) return res.status(400).json({ error: "Ingen e-post" });

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    return res.status(200).json({ name: user?.name || "" });
  }

  if (req.method === "PUT") {
    const { name } = req.body;
    await prisma.user.update({
      where: { email: userEmail },
      data: { name },
    });
    return res.status(200).json({ message: "Namn uppdaterat" });
  }

  res.status(405).end();
}
