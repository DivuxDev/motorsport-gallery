import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer id="contact" className="bg-mx-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/images/logo.jpg"
                alt={settings.siteName}
                width={40}
                height={40}
                className="object-cover rounded-sm"
              />
              <span className="text-3xl font-black uppercase tracking-tight text-white">
                {settings.siteName}
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed font-body">
              © {new Date().getFullYear()} {settings.siteName.toUpperCase()}. CARVED FROM DIRT.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="text-mx-accent font-bold tracking-widest text-xs uppercase mb-5">
              Navegación
            </h4>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body">
                Inicio
              </Link>
              <Link href="/#albums" className="block text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body">
                Álbumes
              </Link>
              <Link href="/login" className="block text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body">
                Admin
              </Link>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-mx-accent font-bold tracking-widest text-xs uppercase mb-5">
              Contacto
            </h4>
            <div className="space-y-3 mb-6">
              {settings.contactLocation && (
                <p className="flex items-center gap-2 text-sm text-neutral-500 font-body">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {settings.contactLocation}
                </p>
              )}

              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {settings.contactEmail}
                </a>
              )}

              {settings.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {settings.contactPhone}
                </a>
              )}

              {settings.contactInstagram && (
                <a
                  href={settings.contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-mx-accent transition-colors font-body"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>

            {/* Contact button */}
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-mx-accent text-mx-accent-on text-xs font-heading font-black uppercase tracking-[0.15em] transition-all hover:bg-mx-accent-strong"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacta con nosotros
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-mx-outline-dim/20">
          <p className="text-xs text-neutral-500 font-body text-center tracking-widest uppercase">
            © {new Date().getFullYear()} {settings.siteName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
