"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#albums", label: "Álbumes" },
  { href: "/#contact", label: "Contacto" },
];

export default function Navbar({ siteName }: { siteName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const name = siteName || "Instinto Enduro";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace("/#", "/"));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/60 backdrop-blur-xl bg-gradient-to-b from-neutral-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.jpg"
              alt={name}
              width={36}
              height={36}
              className="object-cover rounded-sm"
            />
            <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
              {name.toUpperCase()}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? "font-heading uppercase tracking-tight font-bold text-sm text-mx-accent border-b-2 border-mx-accent pb-1 transition-colors"
                      : "font-heading uppercase tracking-tight font-bold text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-mx-light p-2"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-mx-black/90 backdrop-blur-xl border-t border-mx-outline-dim/30">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "block py-2 font-heading uppercase tracking-tight font-bold text-sm text-mx-accent border-l-2 border-mx-accent pl-3 transition-colors"
                      : "block py-2 font-heading uppercase tracking-tight font-bold text-sm text-neutral-400 hover:text-neutral-100 pl-3 transition-colors"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
