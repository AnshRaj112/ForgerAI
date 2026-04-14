"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import styles from "./hero.module.css";
import pageStyles from "../../app/page.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      {/* Subtle Pattern Background */}
      <div className={styles.backgroundPattern} />

      {/* Content */}
      <div className={styles.content}>
        {/* Tag line pill */}
        <div className={styles.tagline}>
          <Sparkles size={14} />
          <span>The Future of AI Agent Development</span>
        </div>

        {/* Headline */}
        <h1 className={styles.title}>
          Build AI Agents.{" "}
          <span className="text-gradient">Forge Them</span>{" "}
          in Every Language.
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          The first visual platform that automatically compiles your AI agents into
          optimized polyglot microservices — Python for AI, Rust for performance,
          Go for orchestration, and more.
        </p>

        {/* CTAs */}
        <div className={styles.actions}>
          <Link href="/builder">
            <button className={pageStyles.primaryButton}>
              <Sparkles size={18} />
              Start Building
            </button>
          </Link>
          <Link href="/marketplace">
            <button className={styles.secondaryButton}>
              Explore Marketplace
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        {/* Language row */}
        <div className={styles.languageRow}>
          {[
            { name: "Python", color: "#3b82f6" },
            { name: "Rust", color: "#f97316" },
            { name: "Go", color: "#06b6d4" },
            { name: "Java", color: "#ef4444" },
            { name: "Ruby", color: "#ec4899" },
            { name: "PHP", color: "#8b5cf6" },
            { name: "Node.js", color: "#22c55e" },
          ].map((lang) => (
            <div key={lang.name} className={styles.languageItem}>
              <span
                className={styles.languageDot}
                style={{ background: lang.color }}
              />
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
