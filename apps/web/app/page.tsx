"use client";

import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.layout}>
      {/* ─── Navbar ─── */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navBrand}>
          <div className={styles.navLogo}>F</div>
          <span>ForgeAI</span>
        </Link>

        <div className={styles.navLinks}>
          {[
            { label: "Builder", href: "/builder" },
            { label: "Marketplace", href: "/marketplace" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Docs", href: "#" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <Link href="/builder">
            <button className={styles.ctaButton}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <Hero />

      {/* ─── Features ─── */}
      <Features />


      {/* ─── CTA Section ─── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>
            Ready to <span className="text-gradient">Forge Your First Agent</span>?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join the polyglot revolution. Build faster, deploy smarter, scale infinitely.
          </p>
          <Link href="/builder">
            <button className={styles.primaryButton}>
              Launch the Builder →
            </button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>F</div>
            <span>ForgeAI</span>
            <span style={{ color: "var(--color-text-tertiary)", marginLeft: "8px", fontWeight: "normal" }}>
              © {new Date().getFullYear()}
            </span>
          </div>

          <div className={styles.footerLinks}>
            <Link href="#">
              <Github size={20} />
            </Link>
            <Link href="#">
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
