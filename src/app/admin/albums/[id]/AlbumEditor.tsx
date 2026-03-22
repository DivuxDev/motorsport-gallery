"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import UploadedImage from "@/components/UploadedImage";
import Link from "next/link";

interface Photo {
  id: string;
  filename: string;
  fullUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  size: number;
  order: number;
  createdAt: string;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  published: boolean;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
}

export default function AlbumEditor({ album }: { album: Album }) {
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description);
  const [eventDate, setEventDate] = useState(album.eventDate);
  const [published, setPublished] = useState(album.published);
  const [photos, setPhotos] = useState<Photo[]>(album.photos);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/albums/${album.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, eventDate, published }),
    });
    setSaving(false);
    router.refresh();
  }

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
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
        formData.append("albumId", album.id);
        batch.forEach((f) => formData.append("photos", f));

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const newPhotos = await res.json();
          setPhotos((prev) => [...prev, ...newPhotos]);
        }

        setUploadProgress(
          Math.min(100, ((i + batch.length) / fileArray.length) * 100)
        );
      }

      setUploading(false);
      setUploadProgress(0);
    },
    [album.id]
  );

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  async function handleSetCover(thumbUrl: string) {
    await fetch(`/api/albums/${album.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverUrl: thumbUrl }),
    });
    router.refresh();
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/admin/albums"
          className="w-9 h-9 flex items-center justify-center bg-mx-container text-gray-500 hover:text-mx-accent hover:bg-mx-gray transition-colors"
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
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 mb-1">
            Editando álbum
          </p>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tighter leading-none text-mx-light truncate">
            {title || "Sin título"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-mx-accent disabled:opacity-50 text-mx-accent-on text-xs font-heading font-black uppercase tracking-[0.15em] transition-all hover:bg-mx-accent-strong"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Album details */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
              Título del álbum
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading font-bold text-lg transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading transition-colors resize-none"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Date */}
          <div>
            <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
              Fecha del evento
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading transition-colors"
            />
          </div>

          {/* Published toggle */}
          <div>
            <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
              Visibilidad
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-11 h-6 transition-colors relative shrink-0 ${
                  published ? "bg-mx-accent" : "bg-mx-gray"
                }`}
                onClick={() => setPublished(!published)}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white transition-transform ${
                    published ? "left-6" : "left-1"
                  }`}
                />
              </div>
              <div>
                <span className="text-sm font-heading font-bold text-mx-light uppercase tracking-wide">
                  {published ? "Publicado" : "Borrador"}
                </span>
                <p className="text-[10px] text-gray-500 font-heading mt-0.5">
                  {published
                    ? "Visible en el sitio público"
                    : "Solo visible en el panel"}
                </p>
              </div>
            </label>
          </div>

          {/* Meta info */}
          <div className="bg-mx-dark p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[9px] font-heading uppercase tracking-[0.15em] text-gray-600">
                Slug
              </span>
              <span className="text-[10px] font-heading text-gray-500 truncate max-w-[140px]">
                {album.slug}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] font-heading uppercase tracking-[0.15em] text-gray-600">
                Fotos
              </span>
              <span className="text-[10px] font-heading font-bold text-mx-accent">
                {photos.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] font-heading uppercase tracking-[0.15em] text-gray-600">
                Creado
              </span>
              <span className="text-[10px] font-heading text-gray-500">
                {new Date(album.createdAt).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                JPG · PNG · WebP
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

      {/* Photos grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">
              Galería de fotos
            </h2>
            <span className="text-[10px] font-heading font-bold text-mx-accent uppercase tracking-wider">
              {photos.length} imágenes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square bg-mx-dark overflow-hidden"
              >
                {/* Cover badge */}
                {album.coverUrl === photo.thumbUrl && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[8px] font-heading font-black uppercase tracking-[0.15em] px-2 py-1 bg-mx-accent text-mx-accent-on">
                      PORTADA
                    </span>
                  </div>
                )}

                <UploadedImage
                  src={photo.thumbUrl}
                  alt={photo.filename}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  sizes="200px"
                />

                {/* Hover overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-mx-black/90 via-mx-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Action buttons stacked vertically */}
                <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-1.5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleSetCover(photo.thumbUrl)}
                    className="w-full px-2 py-1.5 bg-mx-accent/90 hover:bg-mx-accent text-mx-accent-on text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors"
                  >
                    Establecer como Portada
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="w-full px-2 py-1.5 bg-mx-error-container/80 hover:bg-mx-error-container text-mx-error text-[9px] font-heading font-black uppercase tracking-[0.15em] transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
