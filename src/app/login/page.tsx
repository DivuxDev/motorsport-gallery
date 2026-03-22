"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState("Instinto Enduro");

  useEffect(() => {
    const name = document.body.getAttribute("data-site-name");
    if (name) setSiteName(name);
  }, []);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0e0e0e" }}
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--color-mx-accent-strong) 15%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Abstract blur elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-mx-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mx-mud/5 blur-[120px] pointer-events-none" />

      {/* Main content shell */}
      <main className="relative z-10 w-full max-w-md px-6">

        {/* Brand header */}
        <div className="text-center mb-10">
          <Image
            src="/images/logo.jpg"
            alt={siteName}
            width={48}
            height={48}
            className="mx-auto mb-5 object-cover"
          />
          <h1
            className="font-heading italic font-black text-4xl tracking-tighter uppercase text-mx-accent-strong"
          >
            {siteName.toUpperCase()}
          </h1>
          <p className="font-body text-[0.75rem] uppercase tracking-[0.2em] text-mx-outline mt-2">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 shadow-2xl relative"
          style={{
            backgroundColor: "#1c1b1b",
            border: "1px solid rgba(85, 66, 65, 0.1)",
          }}
        >
          {/* Decorative corner accents — top-left L-shape */}
          <div
            className="absolute -top-[1px] -left-[1px] w-8 h-[2px] bg-mx-accent"
          />
          <div
            className="absolute -top-[1px] -left-[1px] w-[2px] h-8 bg-mx-accent"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="px-4 py-3 bg-mx-error-container/20 text-mx-error text-sm font-body">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5 shutter-focus group">
              <label
                htmlFor="email"
                className="block font-body text-[0.65rem] uppercase font-bold tracking-widest text-mx-outline group-focus-within:text-mx-accent transition-colors"
              >
                Email de acceso
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ADMIN@INSTINTOENDURO.COM"
                  required
                  className="w-full bg-mx-mid text-mx-light font-body text-sm py-4 px-4 focus:outline-none focus:ring-0 placeholder:text-mx-bright border-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5 shutter-focus group">
              <label
                htmlFor="password"
                className="block font-body text-[0.65rem] uppercase font-bold tracking-widest text-mx-outline group-focus-within:text-mx-accent transition-colors"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-mx-mid text-mx-light font-body text-sm py-4 px-4 focus:outline-none focus:ring-0 placeholder:text-mx-bright border-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full font-heading font-extrabold text-sm py-4 uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 bg-mx-accent-strong hover:bg-mx-accent text-mx-accent-on"
              >
                {loading ? "ENTRANDO..." : "ENTRAR"}
                {!loading && (
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Card footer */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="/"
              className="font-body text-[0.7rem] uppercase tracking-wider text-mx-bright hover:text-mx-accent transition-colors duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                keyboard_backspace
              </span>
              Volver a la galería
            </a>
          </div>
        </div>

        {/* System version info */}
        <div className="mt-12 flex justify-between items-center opacity-30 px-2">
          <span className="font-body text-[0.6rem] uppercase tracking-tighter text-mx-outline">
            System v4.0.2
          </span>
          <span className="font-body text-[0.6rem] uppercase tracking-tighter text-mx-outline">
            Secure Connection
          </span>
        </div>
      </main>

      {/* Fixed footer */}
      <footer className="fixed bottom-0 w-full flex flex-col items-center gap-4 pb-8 pointer-events-none">
        <div className="w-12 h-[1px] bg-mx-outline-dim/20 mb-2" />
        <p className="font-body text-[0.75rem] uppercase tracking-[0.1em] text-mx-bright">
          &copy; {new Date().getFullYear()} {siteName.toUpperCase()}
        </p>
      </footer>
    </div>
  );
}
