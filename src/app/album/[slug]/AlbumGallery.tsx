"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

interface Photo {
  id: string;
  filename: string;
  fullUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
}

const PAGE_SIZE = 24;

export default function AlbumGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  return (
    <>
      {/* Masonry layout via CSS columns */}
      <div
        className="[column-count:2] sm:[column-count:3] lg:[column-count:4] gap-1 [column-gap:4px]"
      >
        {visible.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full mb-1 overflow-hidden bg-mx-container animate-fade-up cursor-zoom-in break-inside-avoid"
            style={{ animationDelay: `${(i % PAGE_SIZE) * 30}ms` }}
          >
            <Image
              src={photo.thumbUrl}
              alt={photo.filename}
              width={photo.width || 800}
              height={photo.height || 600}
              className="w-full h-auto block photo-grayscale group-hover:scale-105 transition-all duration-500 object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay with primary tint */}
            <div className="absolute inset-0 bg-mx-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Zoom icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-mx-black/60 flex items-center justify-center">
                <svg className="w-5 h-5 text-mx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="group relative inline-flex items-center gap-3 border border-mx-accent/50 hover:border-mx-accent bg-transparent hover:bg-mx-accent/10 text-mx-accent font-heading font-black uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300"
          >
            <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Load More Frames
          </button>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
