"use client";

import Image, { ImageProps } from "next/image";

function toFileUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith("/api/") || src.startsWith("http")) return src;
  if (src.startsWith("/")) return `/api/files${src}`;
  return src;
}

/**
 * Drop-in replacement for next/image that routes uploaded files
 * through /api/files/ and skips the image optimizer (already WebP from Sharp).
 */
export default function UploadedImage({ src, ...props }: ImageProps) {
  const resolvedSrc = typeof src === "string" ? toFileUrl(src) : src;
  return <Image {...props} src={resolvedSrc} unoptimized />;
}
