import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const album = await prisma.album.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(album);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const album = await prisma.album.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl }),
      ...(body.eventDate !== undefined && {
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
      }),
    },
  });
  return NextResponse.json(album);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
