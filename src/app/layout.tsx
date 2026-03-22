import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Instinto Enduro — Fotografía Motocross",
  description:
    "Galería profesional de fotografía de enduro y motocross. Capturamos la adrenalina, el barro y la velocidad.",
};

export const revalidate = 5;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  // Inject theme as CSS custom properties so Tailwind tokens get overridden
  const themeVars = {
    "--color-mx-accent": settings.primaryColor,
    "--color-mx-accent-strong": settings.accentStrong,
    "--color-mx-accent-on": settings.accentOn,
    "--color-mx-mud": settings.secondaryColor,
    "--color-mx-mint": settings.tertiaryColor,
  } as React.CSSProperties;

  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className="font-body antialiased"
        style={themeVars}
        data-grayscale={settings.photosGrayscale ? "true" : "false"}
        data-slider-interval={settings.sliderInterval}
        data-site-name={settings.siteName}
      >
        {children}
      </body>
    </html>
  );
}
