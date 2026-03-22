import { prisma } from "@/lib/prisma";
import Image from "next/image";
import UploadedImage from "@/components/UploadedImage";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [albums, sliderImages, settings] = await Promise.all([
    prisma.album.findMany({
      where: { published: true },
      include: { _count: { select: { photos: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sliderImage.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, url: true },
    }),
    getSettings(),
  ]);

  const totalPhotos = albums.reduce((acc, a) => acc + a._count.photos, 0);
  const contactHref = settings.contactEmail
    ? `mailto:${settings.contactEmail}`
    : "#contact";

  return (
    <>
      <Navbar siteName={settings.siteName} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-start pt-20 px-8 overflow-hidden">
        {/* Background slider + grayscale + gradient-from-left */}
        <div className="absolute inset-0 z-0">
          <HeroSlider images={sliderImages} />
          {/* gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-mx-black via-mx-black/80 to-transparent" />
        </div>

        {/* Left-aligned content */}
        <div className="relative z-10 max-w-5xl">
          <h1 className="font-heading text-7xl md:text-9xl font-black italic tracking-tighter text-mx-light leading-[0.85] mb-4">
            {(() => {
              const words = settings.siteName.toUpperCase().split(" ");
              if (words.length <= 1) return <span className="text-mx-accent">{words[0]}</span>;
              return (
                <>
                  {words.slice(0, -1).join(" ")}
                  <br />
                  <span className="text-mx-accent">{words[words.length - 1]}</span>
                </>
              );
            })()}
          </h1>

          <p className="font-heading text-xl md:text-2xl text-mx-light/50 uppercase tracking-widest font-light mb-12 max-w-2xl">
            Capturamos la adrenalina del enduro. Fotografía profesional nacida
            del barro y la velocidad.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <Link
              href="#albums"
              className="bg-mx-accent text-mx-accent-on px-10 py-5 font-heading font-black uppercase tracking-widest text-lg hover:bg-mx-accent-strong transition-all hover:translate-x-2 active:scale-95 inline-block text-center"
            >
              Ver Álbumes
            </Link>
            <a
              href={contactHref}
              className="border-2 border-mx-outline-dim text-mx-light px-10 py-5 font-heading font-black uppercase tracking-widest text-lg hover:bg-mx-mid transition-all active:scale-95 inline-block text-center"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Vertical rotated text — hidden on mobile */}
        <div className="absolute right-8 bottom-24 hidden lg:block">
          <span className="font-heading text-9xl font-black uppercase select-none text-stroke-primary opacity-20 block rotate-90 origin-bottom-right">
            ADRENALINE
          </span>
        </div>
      </section>

      {/* ── Marquee ticker ───────────────────────────────────── */}
      <div className="bg-mx-dark py-4 overflow-hidden border-y border-mx-outline-dim/10">
        {/*
          Duplicate the items inside the animated wrapper so the strip is
          twice as wide; the animation shifts it left by 50% (= one copy),
          which creates a seamless infinite loop without JS.
        */}
        <div className="flex whitespace-nowrap animate-marquee">
          {/* First copy */}
          <TickerItems totalPhotos={totalPhotos} albumCount={albums.length} />
          {/* Second copy — identical, needed for the seamless loop */}
          <TickerItems totalPhotos={totalPhotos} albumCount={albums.length} />
        </div>
      </div>

      {/* ── Album grid ───────────────────────────────────────── */}
      <section id="albums" className="py-24 px-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-heading text-5xl font-black uppercase tracking-tighter mb-2">
              RECENT ALBUMS
            </h2>
            <div className="h-1 w-24 bg-mx-accent" />
          </div>
          {albums.length > 6 && (
            <Link
              href="#albums"
              className="text-mx-accent font-heading font-bold uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2"
            >
              Ver Todos
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mx-outline text-lg font-body">
              Próximamente nuevos álbumes...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/album/${album.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-mx-black block"
              >
                {/* Image — grayscale by default, color on hover */}
                {album.coverUrl ? (
                  <UploadedImage
                    src={album.coverUrl}
                    alt={album.title}
                    fill
                    className="object-cover photo-grayscale group-hover:scale-105 duration-700 opacity-80"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-mx-mid">
                    <svg
                      className="w-16 h-16"
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

                {/* Gradient overlay from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                {/* Card body */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  {album.eventDate && (
                    <span className="text-mx-accent font-body font-bold tracking-[0.2em] mb-2 uppercase text-sm">
                      {new Date(album.eventDate).toLocaleDateString("es-ES", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <h3 className="font-heading text-3xl font-black text-mx-light uppercase leading-none mb-4 group-hover:text-mx-accent transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-body text-xs uppercase tracking-widest text-mx-outline">
                      {album._count.photos} fotos
                    </span>
                    {/* Arrow — visible on hover */}
                    <svg
                      className="w-5 h-5 text-mx-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 border-0 group-hover:border-4 border-mx-accent transition-all duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Asymmetric editorial ─────────────────────────────── */}
      <section className="py-24 bg-mx-black">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Image with offset border decoration */}
          <div className="relative order-2 md:order-1">
            <div className="aspect-square bg-mx-gray relative overflow-visible">
              <Image
                src="/images/logo.jpg"
                alt="Instinto Enduro — the vision"
                fill
                className="object-cover"
              />
              {/* Offset border decoration */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 border-8 border-mx-accent/20 z-0 pointer-events-none" />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <h3 className="text-mx-accent font-body font-black tracking-[0.4em] mb-6 uppercase text-sm">
              THE VISION
            </h3>
            <h2 className="font-heading text-6xl font-black uppercase tracking-tighter leading-none mb-8">
              BEYOND THE
              <br />
              DUST CLOUD.
            </h2>
            <p className="text-mx-outline text-lg leading-relaxed mb-10 max-w-lg font-body">
              Cada piloto tiene una historia escrita en el barro. No solo
              tomamos fotos — capturamos la lucha mecánica, el esfuerzo físico
              y la pura euforia de cruzar la meta.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-mx-outline-dim/30 pt-10">
              <div>
                <p className="font-heading text-4xl font-black text-mx-light mb-2">
                  RAW
                </p>
                <p className="font-body text-xs uppercase tracking-widest text-mx-outline">
                  Intensidad sin filtros
                </p>
              </div>
              <div>
                <p className="font-heading text-4xl font-black text-mx-light mb-2">
                  GRIT
                </p>
                <p className="font-body text-xs uppercase tracking-widest text-mx-outline">
                  El alma del enduro
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 px-8 text-center relative overflow-hidden">
        {/* Huge background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none whitespace-nowrap">
          <span className="font-heading text-[30vw] font-black italic">
            TIERRA METAL Y BARRO
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="font-heading text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
            NECESITAS NUESTRA AYUDA?
          </h2>
          <p className="font-heading text-xl text-mx-outline uppercase tracking-widest mb-12">
            RESERVA A NUESTROS FOTÓGRAFOS PARA TU PRÓXIMA CARRERA
          </p>
          {/* 3D shadow button */}
          <a
            href={contactHref}
            className="cta-3d-btn inline-block bg-mx-accent text-mx-accent-on px-16 py-6 font-heading font-black uppercase tracking-[0.3em] text-xl transition-all"
          >
            CONTACTA CON NOSOTROS
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ── Ticker helper (inline — avoids a separate file for a tiny component) ── */
function TickerItems({
  totalPhotos,
  albumCount,
}: {
  totalPhotos: number;
  albumCount: number;
}) {
  return (
    <span className="flex items-center gap-12 pr-12">
      <span className="font-heading text-sm font-bold text-mx-accent tracking-widest uppercase flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        ÚLTIMO: RALLY DEL DESIERTO 2024
      </span>
      <span className="font-heading text-sm font-bold text-mx-outline tracking-widest uppercase">
        /
      </span>
      <span className="font-heading text-sm font-bold text-mx-accent tracking-widest uppercase flex items-center gap-2">
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
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {totalPhotos > 0 ? `${totalPhotos.toLocaleString()}+` : "HIGH-RES"} CAPTURES
      </span>
      <span className="font-heading text-sm font-bold text-mx-outline tracking-widest uppercase">
        /
      </span>
      <span className="font-heading text-sm font-bold text-mx-accent tracking-widest uppercase flex items-center gap-2">
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {albumCount} ALBUMS — WORLDWIDE COVERAGE
      </span>
      <span className="font-heading text-sm font-bold text-mx-outline tracking-widest uppercase">
        /
      </span>
    </span>
  );
}
