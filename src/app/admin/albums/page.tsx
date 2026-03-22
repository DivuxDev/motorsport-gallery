import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeleteAlbumButton from "./DeleteAlbumButton";

export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const albums = await prisma.album.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 mb-2">
            Gestión de
          </p>
          <h1 className="font-heading text-5xl font-black uppercase tracking-tighter leading-none text-mx-light">
            Álbumes <span className="text-mx-accent">Fotográficos</span>
          </h1>
        </div>
        <Link
          href="/admin/albums/new"
          className="px-5 py-3 bg-mx-accent text-mx-accent-on text-xs font-heading font-black uppercase tracking-[0.15em] transition-all hover:bg-mx-accent-strong"
        >
          + Nuevo Álbum
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="bg-mx-dark border-l-4 border-mx-accent p-12 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-sm font-heading font-bold uppercase tracking-wider text-gray-500 mb-4">
            No hay álbumes creados
          </p>
          <Link
            href="/admin/albums/new"
            className="text-xs font-heading font-black uppercase tracking-[0.15em] text-mx-accent hover:text-mx-accent-strong transition-colors"
          >
            Crear primer álbum →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-mx-dark overflow-hidden group"
            >
              {/* Thumbnail */}
              <Link href={`/admin/albums/${album.id}`}>
                <div className="aspect-video relative bg-mx-gray overflow-hidden">
                  {album.coverUrl ? (
                    <Image
                      src={album.coverUrl}
                      alt={album.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Status badge overlay */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[9px] font-heading font-black uppercase tracking-[0.15em] px-2 py-1 ${
                        album.published
                          ? "bg-mx-mint/10 text-mx-mint"
                          : "bg-mx-mud/10 text-mx-mud"
                      }`}
                    >
                      {album.published ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="p-4 border-t border-mx-gray/30">
                <div className="mb-3">
                  <Link href={`/admin/albums/${album.id}`}>
                    <h3 className="font-heading font-black text-sm uppercase tracking-wide text-mx-light group-hover:text-mx-accent transition-colors leading-tight mb-1">
                      {album.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-heading text-gray-500 uppercase tracking-wider">
                      {album._count.photos} fotos
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="text-[10px] font-heading text-gray-500">
                      {new Date(album.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/albums/${album.id}`}
                    className="flex-1 px-3 py-2 text-[10px] text-center font-heading font-black uppercase tracking-[0.15em] bg-mx-gray hover:bg-mx-bright text-gray-400 hover:text-mx-light transition-colors"
                  >
                    Editar
                  </Link>
                  <DeleteAlbumButton albumId={album.id} albumTitle={album.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
