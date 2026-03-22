"use client";

import { useState } from "react";

interface SiteSettings {
  primaryColor: string;
  accentStrong: string;
  accentOn: string;
  secondaryColor: string;
  tertiaryColor: string;
  photosGrayscale: boolean;
  sliderInterval: number;
  siteName: string;
  contactEmail: string;
  contactInstagram: string;
  contactPhone: string;
  contactLocation: string;
}

const PRESETS = [
  {
    name: "Dusty Rose (Original)",
    primaryColor: "#ffb3ae",
    accentStrong: "#d67570",
    accentOn: "#5d1717",
    secondaryColor: "#ecc165",
    tertiaryColor: "#75d9b2",
  },
  {
    name: "Naranja Fuego",
    primaryColor: "#ff7a00",
    accentStrong: "#cc6200",
    accentOn: "#1a0800",
    secondaryColor: "#ffd166",
    tertiaryColor: "#06d6a0",
  },
  {
    name: "Azul Eléctrico",
    primaryColor: "#60a5fa",
    accentStrong: "#3b82f6",
    accentOn: "#0a1628",
    secondaryColor: "#fbbf24",
    tertiaryColor: "#34d399",
  },
  {
    name: "Verde Neón",
    primaryColor: "#4ade80",
    accentStrong: "#22c55e",
    accentOn: "#052e16",
    secondaryColor: "#facc15",
    tertiaryColor: "#a78bfa",
  },
  {
    name: "Rojo Agresivo",
    primaryColor: "#f87171",
    accentStrong: "#dc2626",
    accentOn: "#1c0404",
    secondaryColor: "#fb923c",
    tertiaryColor: "#38bdf8",
  },
  {
    name: "Dorado Premium",
    primaryColor: "#fbbf24",
    accentStrong: "#d97706",
    accentOn: "#1c1000",
    secondaryColor: "#fb923c",
    tertiaryColor: "#a78bfa",
  },
];

export default function SettingsEditor({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setSettings((s) => ({
      ...s,
      primaryColor: preset.primaryColor,
      accentStrong: preset.accentStrong,
      accentOn: preset.accentOn,
      secondaryColor: preset.secondaryColor,
      tertiaryColor: preset.tertiaryColor,
    }));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 mb-2">
            Configuración
          </p>
          <h1 className="font-heading text-5xl font-black uppercase tracking-tighter leading-none text-mx-light">
            Ajustes de la{" "}
            <span className="text-mx-accent">WEB</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-heading text-mx-mint uppercase tracking-wider">
              Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 bg-mx-accent text-mx-accent-on text-xs font-heading font-black uppercase tracking-[0.15em] transition-all hover:bg-mx-accent-strong disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Theme settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Site name */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Nombre del sitio
            </h2>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, siteName: e.target.value }))
              }
              className="w-full px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading font-bold text-lg transition-colors"
            />
          </div>

          {/* Contact info */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Datos de contacto
            </h2>
            <div className="space-y-4">
              {[
                { key: "contactEmail" as const, label: "Email", type: "email", placeholder: "info@instintoenduro.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { key: "contactInstagram" as const, label: "Instagram (URL)", type: "url", placeholder: "https://instagram.com/instintoenduro", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { key: "contactPhone" as const, label: "Teléfono", type: "tel", placeholder: "+34 600 000 000", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { key: "contactLocation" as const, label: "Ubicación", type: "text", placeholder: "España", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
              ].map(({ key, label, type, placeholder, icon }) => (
                <div key={key}>
                  <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                    <input
                      type={type}
                      value={settings[key]}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="flex-1 px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-body text-sm transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color presets */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Temas predefinidos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => {
                const isActive =
                  settings.primaryColor === preset.primaryColor;
                return (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`p-4 text-left transition-all ${
                      isActive
                        ? "bg-mx-container ring-2 ring-mx-accent"
                        : "bg-mx-container hover:bg-mx-gray"
                    }`}
                  >
                    <div className="flex gap-1.5 mb-3">
                      <div
                        className="w-6 h-6"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div
                        className="w-6 h-6"
                        style={{ backgroundColor: preset.accentStrong }}
                      />
                      <div
                        className="w-6 h-6"
                        style={{ backgroundColor: preset.secondaryColor }}
                      />
                      <div
                        className="w-6 h-6"
                        style={{ backgroundColor: preset.tertiaryColor }}
                      />
                    </div>
                    <p className="text-xs font-heading font-bold text-mx-light uppercase tracking-wide">
                      {preset.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom colors */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Colores personalizados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { key: "primaryColor" as const, label: "Color primario" },
                { key: "accentStrong" as const, label: "Acento fuerte" },
                { key: "accentOn" as const, label: "Texto sobre acento" },
                { key: "secondaryColor" as const, label: "Color secundario" },
                { key: "tertiaryColor" as const, label: "Color terciario" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, [key]: e.target.value }))
                      }
                      className="w-10 h-10 bg-transparent border-0 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={settings[key]}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, [key]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading text-xs uppercase transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Options & Preview */}
        <div className="space-y-6">
          {/* Gallery options */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Opciones de galería
            </h2>

            {/* Grayscale toggle */}
            <div className="flex items-center justify-between py-4 border-b border-mx-gray/30">
              <div>
                <p className="text-sm font-heading font-bold text-mx-light uppercase tracking-wide">
                  Fotos en blanco y negro
                </p>
                <p className="text-[10px] text-gray-500 font-heading mt-0.5">
                  Las fotos se muestran en escala de grises hasta pasar el cursor
                </p>
              </div>
              <div
                className={`w-11 h-6 transition-colors relative cursor-pointer shrink-0 ${
                  settings.photosGrayscale ? "bg-mx-accent" : "bg-mx-gray"
                }`}
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    photosGrayscale: !s.photosGrayscale,
                  }))
                }
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white transition-transform ${
                    settings.photosGrayscale ? "left-6" : "left-1"
                  }`}
                />
              </div>
            </div>

            {/* Slider interval */}
            <div className="pt-4">
              <label className="block text-[9px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                Intervalo del slider (segundos)
              </label>
              <input
                type="number"
                min={2}
                max={15}
                value={settings.sliderInterval / 1000}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    sliderInterval: Number(e.target.value) * 1000,
                  }))
                }
                className="w-full px-4 py-3 bg-mx-gray border-0 border-b-2 border-transparent focus:border-mx-accent focus:outline-none text-mx-light font-heading transition-colors"
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="bg-mx-dark p-6">
            <h2 className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Vista previa del tema
            </h2>
            <div
              className="p-4 space-y-3"
              style={{ backgroundColor: "#131313" }}
            >
              <p
                className="font-heading text-2xl font-black uppercase tracking-tighter"
                style={{ color: settings.primaryColor }}
              >
                {settings.siteName}
              </p>
              <p className="text-xs text-gray-400 font-body">
                Texto de ejemplo sobre fondo oscuro
              </p>
              <div className="flex gap-2">
                <div
                  className="px-4 py-2 text-xs font-heading font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: settings.primaryColor,
                    color: settings.accentOn,
                  }}
                >
                  Botón primario
                </div>
                <div
                  className="px-4 py-2 text-xs font-heading font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: settings.accentStrong,
                    color: "#fff",
                  }}
                >
                  Acento
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span
                  className="text-[10px] font-heading font-black uppercase px-2 py-1"
                  style={{
                    backgroundColor: `${settings.tertiaryColor}20`,
                    color: settings.tertiaryColor,
                  }}
                >
                  Publicado
                </span>
                <span
                  className="text-[10px] font-heading font-black uppercase px-2 py-1"
                  style={{
                    backgroundColor: `${settings.secondaryColor}20`,
                    color: settings.secondaryColor,
                  }}
                >
                  Borrador
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
