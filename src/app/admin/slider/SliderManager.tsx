"use client";

import { useState, useRef, useCallback } from "react";
import UploadedImage from "@/components/UploadedImage";
import { useRouter } from "next/navigation";

interface SliderImage {
  id: string;
  filename: string;
  url: string;
  order: number;
  active: boolean;
  createdAt: string | Date;
}

export default function SliderManager({
  initialImages,
}: {
  initialImages: SliderImage[];
}) {
  const [images, setImages] = useState<SliderImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Upload new images
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!fileArray.length) return;

    setUploading(true);
    setUploadProgress(0);

    const batchSize = 5;
    for (let i = 0; i < fileArray.length; i += batchSize) {
      const batch = fileArray.slice(i, i + batchSize);
      const formData = new FormData();
      batch.forEach((f) => formData.append("images", f));

      const res = await fetch("/api/slider", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newImages: SliderImage[] = await res.json();
        setImages((prev) => [...prev, ...newImages]);
      }

      setUploadProgress(
        Math.min(100, ((i + batch.length) / fileArray.length) * 100)
      );
    }

    setUploading(false);
    setUploadProgress(0);
    router.refresh();
  }, [router]);

  // Delete an image
  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta imagen del slider?")) return;

    const res = await fetch(`/api/slider/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  }

  // Toggle active/inactive
  async function handleToggleActive(image: SliderImage) {
    const res = await fetch(`/api/slider/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !image.active }),
    });

    if (res.ok) {
      const updated: SliderImage = await res.json();
      setImages((prev) =>
        prev.map((img) => (img.id === updated.id ? updated : img))
      );
    }
  }

  // Move image order up or down
  async function handleMoveOrder(id: string, direction: "up" | "down") {
    const idx = images.findIndex((img) => img.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === images.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newImages = [...images];
    // Swap orders
    const tempOrder = newImages[idx].order;
    newImages[idx] = { ...newImages[idx], order: newImages[swapIdx].order };
    newImages[swapIdx] = { ...newImages[swapIdx], order: tempOrder };
    // Swap positions in array
    [newImages[idx], newImages[swapIdx]] = [newImages[swapIdx], newImages[idx]];

    setImages(newImages);

    // Persist both changes
    await Promise.all([
      fetch(`/api/slider/${newImages[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newImages[idx].order }),
      }),
      fetch(`/api/slider/${newImages[swapIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newImages[swapIdx].order }),
      }),
    ]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all mb-10 cursor-pointer ${
          dragOver
            ? "border-mx-accent bg-mx-accent/5"
            : "border-mx-gray hover:border-mx-outline-dim/60"
        }`}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <div className="py-14 px-8 text-center">
          {uploading ? (
            <div>
              <div className="w-64 h-1 bg-mx-gray mx-auto mb-4 overflow-hidden">
                <div
                  className="h-full bg-mx-accent transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gray-500">
                Subiendo imágenes... {Math.round(uploadProgress)}%
              </p>
            </div>
          ) : (
            <>
              <svg
                className={`w-14 h-14 mx-auto mb-5 transition-colors ${
                  dragOver ? "text-mx-accent" : "text-gray-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="font-heading text-2xl font-black uppercase tracking-tighter text-mx-light mb-2">
                ARRASTRA IMÁGENES AQUÍ
              </p>
              <p className="text-xs font-heading text-gray-500 uppercase tracking-[0.15em]">
                O haz clic para{" "}
                <span className="text-mx-accent">seleccionar archivos</span>
              </p>
              <p className="text-[10px] font-heading text-gray-600 mt-2 uppercase tracking-wider">
                JPG · PNG · WebP — se redimensionan a 1920px, WebP calidad 85
              </p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) uploadFiles(e.target.files);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
          Imágenes del slider
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-heading font-bold text-mx-accent uppercase tracking-wider">
            {images.length} total
          </span>
          <span className="text-[10px] font-heading text-gray-600 uppercase tracking-wider">
            {images.filter((i) => i.active).length} activas
          </span>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 bg-mx-dark">
          <p className="text-mx-outline text-sm font-heading uppercase tracking-widest">
            Ninguna imagen cargada aún
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={`group relative aspect-video bg-mx-dark overflow-hidden border-2 transition-colors ${
                image.active
                  ? "border-mx-container hover:border-mx-outline-dim/40"
                  : "border-mx-container/40 opacity-50"
              }`}
            >
              {/* Image preview */}
              <UploadedImage
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Inactive badge */}
              {!image.active && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-[8px] font-heading font-black uppercase tracking-[0.15em] px-2 py-1 bg-mx-dark/90 text-gray-500">
                    INACTIVA
                  </span>
                </div>
              )}

              {/* Order badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className="text-[8px] font-heading font-black uppercase tracking-[0.15em] px-2 py-1 bg-mx-black/80 text-mx-accent">
                  #{idx + 1}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-mx-black/95 via-mx-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Action buttons */}
              <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-1.5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Order controls row */}
                <div className="flex gap-1.5 mb-1">
                  <button
                    onClick={() => handleMoveOrder(image.id, "up")}
                    disabled={idx === 0}
                    className="flex-1 px-2 py-1.5 bg-mx-container/80 hover:bg-mx-container disabled:opacity-30 text-mx-light text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Antes
                  </button>
                  <button
                    onClick={() => handleMoveOrder(image.id, "down")}
                    disabled={idx === images.length - 1}
                    className="flex-1 px-2 py-1.5 bg-mx-container/80 hover:bg-mx-container disabled:opacity-30 text-mx-light text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-1"
                  >
                    Después
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Toggle active */}
                <button
                  onClick={() => handleToggleActive(image)}
                  className={`w-full px-2 py-1.5 text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors ${
                    image.active
                      ? "bg-mx-container/80 hover:bg-mx-container text-mx-outline"
                      : "bg-mx-accent/90 hover:bg-mx-accent text-mx-accent-on"
                  }`}
                >
                  {image.active ? "Desactivar" : "Activar"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="w-full px-2 py-1.5 bg-mx-error-container/80 hover:bg-mx-error-container text-mx-error text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 px-4 py-3 bg-mx-dark border-l-2 border-mx-accent/30">
        <p className="text-[10px] font-heading uppercase tracking-[0.15em] text-gray-600">
          Las imágenes activas se muestran en el slider del hero de la página principal. El orden puede ajustarse con los botones Antes / Después.
        </p>
      </div>
    </div>
  );
}
