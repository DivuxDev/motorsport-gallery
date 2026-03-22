"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminSidebar({ userName, siteName }: { userName: string; siteName?: string }) {
  const name = siteName || "Instinto Enduro";
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/admin/albums",
      label: "Álbumes",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      href: "/admin/slider",
      label: "Slider",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      href: "/admin/settings",
      label: "Ajustes",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  const sidebar = (
    <div className="w-64 h-screen bg-mx-surface flex flex-col fixed z-40">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/admin" className="block">
          <div className="flex items-center gap-3 mb-1">
            <Image
              src="/images/logo.jpg"
              alt={name}
              width={28}
              height={28}
              className="object-cover"
            />
            <span className="font-heading text-2xl font-black italic tracking-tighter text-mx-accent uppercase leading-none">
              {name}
            </span>
          </div>
          <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gray-500 mt-2 pl-[44px]">
            Admin Control
          </p>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-mx-container" />

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-heading font-bold uppercase tracking-wider transition-colors ${
                active
                  ? "border-l-4 border-mx-accent bg-mx-container text-mx-accent"
                  : "border-l-4 border-transparent text-gray-500 hover:text-mx-accent hover:bg-mx-gray"
              }`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={link.icon}
                />
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-6 h-px bg-mx-container" />

      {/* User section */}
      <div className="p-4 pb-6">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 bg-mx-accent-strong/20 flex items-center justify-center text-mx-accent text-xs font-heading font-black shrink-0">
            {userName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-heading font-bold text-mx-light truncate uppercase tracking-wide">
              {userName}
            </p>
            <p className="text-[10px] text-gray-500 font-heading uppercase tracking-[0.15em]">
              Administrador
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 px-3 py-2 text-[10px] text-center font-heading font-bold uppercase tracking-wider text-gray-500 bg-mx-container hover:bg-mx-gray hover:text-mx-light transition-colors"
          >
            Ver sitio
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 px-3 py-2 text-[10px] font-heading font-bold uppercase tracking-wider text-mx-error bg-mx-error-container/10 hover:bg-mx-error-container/25 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-mx-surface flex items-center justify-center text-mx-light border border-mx-container"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {mobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="hidden md:block">{sidebar}</div>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-50">{sidebar}</div>
        </>
      )}
    </>
  );
}
