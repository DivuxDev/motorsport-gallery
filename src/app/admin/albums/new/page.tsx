"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewAlbumPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, eventDate, published }),
    });

    if (res.ok) {
      const album = await res.json();
      router.push(`/admin/albums/${album.id}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/albums" className="text-mx-outline hover:text-mx-accent transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </Link>
        <h1 className="font-heading font-bold text-2xl text-white uppercase tracking-tight">Nuevo Álbum</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[11px] font-body text-mx-outline uppercase tracking-[0.15em] mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-mx-mid text-white placeholder-mx-outline-dim focus:outline-none focus:border-b-2 focus:border-mx-accent transition-colors font-body"
            placeholder="Campeonato Nacional Enduro 2026"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-body text-mx-outline uppercase tracking-[0.15em] mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-mx-mid text-white placeholder-mx-outline-dim focus:outline-none focus:border-b-2 focus:border-mx-accent transition-colors resize-none font-body"
            placeholder="Las mejores tomas del evento..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-body text-mx-outline uppercase tracking-[0.15em] mb-2">
            Fecha del evento
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-3 bg-mx-mid text-white focus:outline-none focus:border-b-2 focus:border-mx-accent transition-colors font-body"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`w-10 h-6 transition-colors relative ${
              published ? "bg-mx-accent-strong" : "bg-mx-gray"
            }`}
            onClick={() => setPublished(!published)}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white transition-transform ${
                published ? "left-5" : "left-1"
              }`}
            />
          </div>
          <span className="text-sm text-mx-outline font-body">Publicar inmediatamente</span>
        </label>

        <button
          type="submit"
          disabled={loading || !title}
          className="px-6 py-3 bg-gradient-to-r from-mx-accent to-mx-accent-strong disabled:opacity-50 text-mx-accent-on font-heading font-bold text-sm uppercase tracking-[0.15em] transition-all hover:shadow-[0_10px_30px_rgba(214,117,112,0.15)]"
        >
          {loading ? "Creando..." : "Crear Álbum"}
        </button>
      </form>
    </div>
  );
}
