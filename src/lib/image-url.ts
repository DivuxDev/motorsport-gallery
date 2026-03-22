/**
 * In standalone Docker mode, files in /public uploaded at runtime
 * are not served by Next.js static file serving.
 * This rewrites URLs to go through /api/files/ which reads from disk.
 */
export function fileUrl(url: string): string {
  if (!url) return url;
  // Already an API or external URL — leave it alone
  if (url.startsWith("/api/") || url.startsWith("http")) return url;
  // Rewrite /uploads/... or /images/slider/... to /api/files/...
  if (url.startsWith("/")) return `/api/files${url}`;
  return url;
}
