import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const albumId = formData.get("albumId") as string;
  if (!albumId) {
    return NextResponse.json({ error: "albumId requerido" }, { status: 400 });
  }

  const files = formData.getAll("photos") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "No hay archivos" }, { status: 400 });
  }

  const uploadsFullDir = path.join(process.cwd(), "public", "uploads", "full");
  const uploadsThumbDir = path.join(process.cwd(), "public", "uploads", "thumbs");
  await fs.mkdir(uploadsFullDir, { recursive: true });
  await fs.mkdir(uploadsThumbDir, { recursive: true });

  const photos = [];
  const currentCount = await prisma.photo.count({ where: { albumId } });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = uuid();
    const ext = "webp";
    const filename = `${id}.${ext}`;

    // Process full size (max 2000px wide, quality 85)
    const fullImage = sharp(buffer).resize(2000, null, {
      withoutEnlargement: true,
    });
    const fullMeta = await fullImage.webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
    await fs.writeFile(path.join(uploadsFullDir, filename), fullMeta.data);

    // Thumbnail (400px wide)
    const thumbBuffer = await sharp(buffer)
      .resize(400, 300, { fit: "cover" })
      .webp({ quality: 75 })
      .toBuffer();
    await fs.writeFile(path.join(uploadsThumbDir, filename), thumbBuffer);

    const photo = await prisma.photo.create({
      data: {
        id,
        filename: file.name,
        fullUrl: `/uploads/full/${filename}`,
        thumbUrl: `/uploads/thumbs/${filename}`,
        width: fullMeta.info.width,
        height: fullMeta.info.height,
        size: fullMeta.info.size,
        albumId,
        order: currentCount + i,
      },
    });
    photos.push(photo);
  }

  // Set first photo as cover if album has no cover
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (album && !album.coverUrl && photos.length > 0) {
    await prisma.album.update({
      where: { id: albumId },
      data: { coverUrl: photos[0].thumbUrl },
    });
  }

  return NextResponse.json(photos, { status: 201 });
}
