import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const albums = await prisma.album.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(albums);
}
