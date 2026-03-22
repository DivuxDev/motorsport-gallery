import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete files from disk
  const publicDir = path.join(process.cwd(), "public");
  try {
    await fs.unlink(path.join(publicDir, photo.fullUrl));
    await fs.unlink(path.join(publicDir, photo.thumbUrl));
  } catch {
    // files may not exist
  }

  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
