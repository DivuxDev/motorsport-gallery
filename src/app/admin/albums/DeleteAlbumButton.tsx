"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAlbumButton({
  albumId,
  albumTitle,
}: {
  albumId: string;
  albumTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${albumTitle}"? Se borrarán todas sus fotos.`)) return;

    setLoading(true);
    await fetch(`/api/albums/${albumId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-xs bg-mx-error-container/10 hover:bg-mx-error-container/20 text-mx-error transition-colors disabled:opacity-50 font-body"
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}
