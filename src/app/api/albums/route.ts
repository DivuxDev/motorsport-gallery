import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const albums = await prisma.album.findMany({
    where: { published: true },
    include: { _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const album = await prisma.album.create({
    data: {
      title: body.title,
      slug: `${slug}-${Date.now().toString(36)}`,
      description: body.description || "",
      published: body.published ?? false,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
    },
  });
  return NextResponse.json(album, { status: 201 });
}
