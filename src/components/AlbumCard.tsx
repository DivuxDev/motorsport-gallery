import Link from "next/link";
import Image from "next/image";

interface AlbumCardProps {
  album: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverUrl: string | null;
    eventDate: string | null;
    _count: { photos: number };
  };
  index: number;
}

export default function AlbumCard({ album, index }: AlbumCardProps) {
  return (
    <Link
      href={`/album/${album.slug}`}
      className="group relative block overflow-hidden bg-mx-black animate-fade-up border-4 border-transparent hover:border-mx-accent transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Portrait aspect ratio */}
      <div className="aspect-[3/4] relative overflow-hidden bg-mx-black">
        {album.coverUrl ? (
          <Image
            src={album.coverUrl}
            alt={album.title}
            fill
            className="object-cover opacity-80 photo-grayscale group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-mx-mid">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
      </div>

      {/* Card info — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {album.eventDate && (
          <p className="text-mx-accent tracking-[0.2em] text-xs font-bold uppercase mb-1 font-body">
            {new Date(album.eventDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}

        <h3 className="font-heading font-black text-3xl text-white uppercase leading-none tracking-tight mb-3">
          {album.title}
        </h3>

        {/* Divider + photo count */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-mx-outline-dim/40" />
          <span className="text-xs text-mx-outline font-body font-medium uppercase tracking-widest whitespace-nowrap">
            {album._count.photos} fotos
          </span>
        </div>
      </div>
    </Link>
  );
}
