import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AlbumEditor from "./AlbumEditor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!album) notFound();

  return (
    <AlbumEditor
      album={{
        ...album,
        eventDate: album.eventDate?.toISOString().split("T")[0] ?? "",
        createdAt: album.createdAt.toISOString(),
        updatedAt: album.updatedAt.toISOString(),
        photos: album.photos.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
      }}
    />
  );
}
