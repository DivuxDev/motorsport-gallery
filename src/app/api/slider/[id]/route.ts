import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Admin only — delete file from disk and remove DB record
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const image = await prisma.sliderImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Remove file from disk
  const filePath = path.join(process.cwd(), "public", image.url);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be missing — proceed with DB deletion
  }

  await prisma.sliderImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

// Admin only — update order or active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as { order?: number; active?: boolean };

  const updated = await prisma.sliderImage.update({
    where: { id },
    data: {
      ...(body.order !== undefined && { order: body.order }),
      ...(body.active !== undefined && { active: body.active }),
    },
  });

  return NextResponse.json(updated);
}
