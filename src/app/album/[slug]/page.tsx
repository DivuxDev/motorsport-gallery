import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlbumGallery from "./AlbumGallery";
import { getSettings } from "@/lib/settings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [album, settings] = await Promise.all([
    prisma.album.findUnique({ where: { slug } }),
    getSettings(),
  ]);
  if (!album) return { title: "Álbum no encontrado" };
  return {
    title: `${album.title} — ${settings.siteName}`,
    description: album.description || `Fotos de ${album.title}`,
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await prisma.album.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!album || !album.published) notFound();

  const settings = await getSettings();

  const eventYear = album.eventDate
    ? new Date(album.eventDate).getFullYear()
    : null;

  const eventDateFormatted = album.eventDate
    ? new Date(album.eventDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Navbar siteName={settings.siteName} />

      {/* Hero header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-mx-black via-mx-surface to-mx-surface pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-mx-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-mx-accent transition-colors mb-10 font-body uppercase tracking-widest font-bold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Volver
          </a>

          {/* Badge tags row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {eventYear && (
              <span className="inline-block border border-mx-accent/40 text-mx-accent text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 font-body">
                Serie Vol. {eventYear}
              </span>
            )}
            {eventDateFormatted && (
              <span className="inline-block border border-mx-outline-dim/40 text-mx-outline text-xs font-medium uppercase tracking-[0.15em] px-3 py-1 font-body">
                {eventDateFormatted}
              </span>
            )}
          </div>

          {/* Massive title */}
          <h1 className="font-heading font-black uppercase tracking-tighter leading-none mb-6
            text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            {/* Split: last word gets the accent highlight */}
            {album.title.split(" ").length > 1 ? (
              <>
                <span className="text-white">
                  {album.title.split(" ").slice(0, -1).join(" ")}{" "}
                </span>
                <span className="text-mx-accent">
                  {album.title.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              <span className="text-mx-accent">{album.title}</span>
            )}
          </h1>

          {album.description && (
            <p className="text-base text-mx-outline max-w-2xl font-body mb-8 leading-relaxed">
              {album.description}
            </p>
          )}

          {/* Photo count stat */}
          <div className="flex items-end gap-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-mx-accent leading-none font-heading">
                {album.photos.length}
              </span>
              <span className="text-sm text-neutral-500 font-body uppercase tracking-widest pb-1">
                Fotos
              </span>
            </div>
            <div className="h-px flex-1 max-w-xs bg-mx-outline-dim/30 mb-2" />
          </div>
        </div>
      </section>

      {/* Thin accent rule */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-mx-accent/40 to-transparent" />

      {/* Gallery */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <AlbumGallery photos={album.photos} />
        </div>
      </section>

      <Footer />
    </>
  );
}
