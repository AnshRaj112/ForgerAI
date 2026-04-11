"use client";

import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Architecture } from "@/components/landing/architecture";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--forge-bg)" }}>
      {/* ─── Navbar ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
        style={{
          background: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--forge-border-muted)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--forge-gradient-accent)" }}
          >
            F
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--forge-fg)" }}>
            ForgeAI
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          {[
            { label: "Builder", href: "/builder" },
            { label: "Marketplace", href: "/marketplace" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Docs", href: "#" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--forge-fg-muted)" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--forge-fg)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "var(--forge-fg-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/builder">
            <button
              className="h-9 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: "var(--forge-accent)",
                color: "white",
                boxShadow: "0 0 20px rgba(99,102,241,0.25)",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <Hero />

      {/* ─── Features ─── */}
      <Features />

      {/* ─── Architecture ─── */}
      <Architecture />

      {/* ─── CTA Section ─── */}
      <section className="relative py-32 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to{" "}
            <span className="forge-gradient-text">Forge Your First Agent</span>?
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--forge-fg-muted)" }}>
            Join the polyglot revolution. Build faster, deploy smarter, scale infinitely.
          </p>
          <Link href="/builder">
            <button
              className="h-14 px-10 rounded-xl text-base font-semibold transition-all duration-300 cursor-pointer"
              style={{
                background: "var(--forge-gradient-accent)",
                color: "white",
                boxShadow: "0 0 40px rgba(99,102,241,0.35)",
              }}
            >
              Launch the Builder →
            </button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className="border-t px-6 py-12"
        style={{ borderColor: "var(--forge-border-muted)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "var(--forge-gradient-accent)" }}
            >
              F
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--forge-fg)" }}>
              ForgeAI
            </span>
            <span className="text-xs ml-2" style={{ color: "var(--forge-fg-subtle)" }}>
              © {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="transition-colors duration-200"
              style={{ color: "var(--forge-fg-subtle)" }}
            >
              <Github size={18} />
            </Link>
            <Link
              href="#"
              className="transition-colors duration-200"
              style={{ color: "var(--forge-fg-subtle)" }}
            >
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
