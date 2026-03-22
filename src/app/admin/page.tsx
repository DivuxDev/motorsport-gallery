import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [albumCount, photoCount, publishedCount] = await Promise.all([
    prisma.album.count(),
    prisma.photo.count(),
    prisma.album.count({ where: { published: true } }),
  ]);

  const recentAlbums = await prisma.album.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { photos: true } } },
  });

  const stats = [
    {
      label: "Total Álbumes",
      value: albumCount,
      borderColor: "border-mx-accent",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      iconColor: "text-mx-accent",
    },
    {
      label: "Publicados",
      value: publishedCount,
      borderColor: "border-mx-mint",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      iconColor: "text-mx-mint",
    },
    {
      label: "Total Fotos",
      value: photoCount,
      borderColor: "border-mx-mud",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      iconColor: "text-mx-mud",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 mb-2">
            Bienvenido al
          </p>
          <h1 className="font-heading text-5xl font-black uppercase tracking-tighter leading-none text-mx-light">
            Panel de{" "}
            <span className="text-mx-accent">CONTROL</span>
          </h1>
        </div>
        <Link
          href="/admin/albums/new"
          className="px-5 py-3 bg-mx-accent text-mx-accent-on text-xs font-heading font-black uppercase tracking-[0.15em] transition-all hover:bg-mx-accent-strong"
        >
          + Nuevo Álbum
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-mx-dark border-l-4 ${stat.borderColor} p-6 flex items-center justify-between`}
          >
            <div>
              <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gray-500 mb-3">
                {stat.label}
              </p>
              <p className="font-heading text-5xl font-black text-mx-light leading-none">
                {stat.value}
              </p>
            </div>
            <svg
              className={`w-10 h-10 ${stat.iconColor} opacity-30`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d={stat.icon}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent albums table */}
        <div className="lg:col-span-2 bg-mx-dark">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
              Álbumes Recientes
            </h2>
            <Link
              href="/admin/albums"
              className="text-[10px] font-heading uppercase tracking-wider text-mx-accent hover:text-mx-accent-strong transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {recentAlbums.length === 0 ? (
            <div className="px-6 pb-8 text-center">
              <p className="text-sm text-gray-500 font-heading py-8">
                No hay álbumes aún. ¡Crea el primero!
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-mx-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
                    Álbum
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
                    Fotos
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
                    Fecha
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentAlbums.map((album, i) => (
                  <tr
                    key={album.id}
                    className={`border-t border-mx-gray/40 hover:bg-mx-gray/20 transition-colors ${
                      i % 2 === 0 ? "" : "bg-mx-container/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mx-gray shrink-0 relative overflow-hidden">
                          {album.coverUrl ? (
                            <Image
                              src={album.coverUrl}
                              alt={album.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-600"
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
                        </div>
                        <span className="text-sm font-heading font-bold text-mx-light truncate max-w-[160px]">
                          {album.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-heading text-gray-500">
                        {album._count.photos}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[9px] font-heading font-black uppercase tracking-[0.15em] px-2 py-1 ${
                          album.published
                            ? "bg-mx-mint/10 text-mx-mint"
                            : "bg-mx-mud/10 text-mx-mud"
                        }`}
                      >
                        {album.published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-heading text-gray-500">
                        {new Date(album.createdAt).toLocaleDateString("es-ES")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/albums/${album.id}`}
                        className="text-gray-600 hover:text-mx-accent transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* System status */}
          <div className="bg-mx-dark p-5">
            <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-5">
              Estado del sistema
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-heading text-mx-light uppercase tracking-wide">
                    Álbumes publicados
                  </span>
                  <span className="text-xs font-heading font-bold text-mx-accent">
                    {albumCount > 0
                      ? Math.round((publishedCount / albumCount) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-1 bg-mx-gray">
                  <div
                    className="h-full bg-mx-accent transition-all"
                    style={{
                      width:
                        albumCount > 0
                          ? `${(publishedCount / albumCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-heading text-mx-light uppercase tracking-wide">
                    Borradores
                  </span>
                  <span className="text-xs font-heading font-bold text-mx-mud">
                    {albumCount - publishedCount}
                  </span>
                </div>
                <div className="h-1 bg-mx-gray">
                  <div
                    className="h-full bg-mx-mud transition-all"
                    style={{
                      width:
                        albumCount > 0
                          ? `${((albumCount - publishedCount) / albumCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-heading text-mx-light uppercase tracking-wide">
                    Fotos por álbum
                  </span>
                  <span className="text-xs font-heading font-bold text-mx-mint">
                    {albumCount > 0
                      ? Math.round(photoCount / albumCount)
                      : 0}{" "}
                    avg
                  </span>
                </div>
                <div className="h-1 bg-mx-gray">
                  <div className="h-full bg-mx-mint" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-mx-dark p-5">
            <h3 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-5">
              Actividad reciente
            </h3>
            <div className="space-y-3">
              {recentAlbums.slice(0, 4).map((album) => (
                <div key={album.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 mt-1.5 bg-mx-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-heading text-mx-light truncate">
                      {album.title}
                    </p>
                    <p className="text-[10px] text-gray-600 font-heading mt-0.5">
                      {new Date(album.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-heading font-black uppercase px-1.5 py-0.5 shrink-0 ${
                      album.published
                        ? "bg-mx-mint/10 text-mx-mint"
                        : "bg-mx-mud/10 text-mx-mud"
                    }`}
                  >
                    {album.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
              {recentAlbums.length === 0 && (
                <p className="text-xs text-gray-600 font-heading">
                  Sin actividad reciente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
