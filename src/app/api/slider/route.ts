import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

// Public — returns all active slider images ordered by `order`
export async function GET() {
  const images = await prisma.sliderImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(images);
}

// Admin only — accepts FormData with "images" files
export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No hay archivos" }, { status: 400 });
  }

  const sliderDir = path.join(process.cwd(), "public", "images", "slider");
  await fs.mkdir(sliderDir, { recursive: true });

  const currentCount = await prisma.sliderImage.count();
  const created = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = uuid();
    const filename = `${id}.webp`;

    // Resize to 1920px wide, webp quality 85
    const processed = await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    await fs.writeFile(path.join(sliderDir, filename), processed);

    const record = await prisma.sliderImage.create({
      data: {
        id,
        filename,
        url: `/images/slider/${filename}`,
        order: currentCount + i,
        active: true,
      },
    });

    created.push(record);
  }

  return NextResponse.json(created, { status: 201 });
}
