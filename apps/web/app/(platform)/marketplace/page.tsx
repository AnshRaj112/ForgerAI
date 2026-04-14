"use client";

import { useState } from "react";
import { ForgeCard } from "@/components/ui/forge-card";
import { ForgeButton } from "@/components/ui/forge-button";
import { LanguageBadge } from "@/components/ui/language-badge";
import { Search, Star, Download, Sparkles } from "lucide-react";
import styles from "./marketplace.module.css";

const CATEGORIES = ["All", "AI & ML", "Automation", "Data", "Security", "Content", "Integration", "Enterprise"];

const MARKETPLACE_AGENTS = [
  {
    id: "1",
    title: "Customer Support AI",
    summary: "Multi-language customer support with RAG and escalation workflows",
    category: "AI & ML",
    languages: ["python", "go", "node", "ruby"],
    rating: 4.8,
    installs: 2340,
    pricing: "free" as const,
    author: "ForgeAI Team",
    featured: true,
  },
  {
    id: "2",
    title: "Data Pipeline Orchestrator",
    summary: "ETL pipeline with real-time streaming, transformation, and validation",
    category: "Data",
    languages: ["python", "rust", "go"],
    rating: 4.6,
    installs: 1890,
    pricing: "free" as const,
    author: "DataForge Labs",
    featured: true,
  },
  {
    id: "3",
    title: "Security Audit Agent",
    summary: "Automated security scanning with cryptographic verification and compliance checks",
    category: "Security",
    languages: ["rust", "java", "go"],
    rating: 4.9,
    installs: 1205,
    pricing: "paid" as const,
    price: 29,
    author: "SecureForge Inc",
    featured: false,
  },
  {
    id: "4",
    title: "Content Generation Suite",
    summary: "AI-powered content creation with SEO optimization and multi-channel publishing",
    category: "Content",
    languages: ["python", "php", "node"],
    rating: 4.5,
    installs: 3120,
    pricing: "free" as const,
    author: "ContentAI",
    featured: true,
  },
  {
    id: "5",
    title: "Sales Automation Pro",
    summary: "Lead scoring, CRM integration, and automated follow-up with approval workflows",
    category: "Enterprise",
    languages: ["python", "java", "ruby", "node"],
    rating: 4.7,
    installs: 890,
    pricing: "subscription" as const,
    price: 49,
    author: "Enterprise Forge",
    featured: false,
  },
  {
    id: "6",
    title: "API Integration Hub",
    summary: "Connect any API with intelligent routing, retry logic, and data mapping",
    category: "Integration",
    languages: ["node", "go", "typescript"],
    rating: 4.4,
    installs: 4210,
    pricing: "free" as const,
    author: "IntegrationAI",
    featured: false,
  },
  {
    id: "7",
    title: "Invoice Processing Agent",
    summary: "OCR, data extraction, validation, and accounting system integration",
    category: "Enterprise",
    languages: ["python", "java", "rust"],
    rating: 4.6,
    installs: 670,
    pricing: "paid" as const,
    price: 19,
    author: "FinanceForge",
    featured: false,
  },
  {
    id: "8",
    title: "Sentiment Analysis Bot",
    summary: "Real-time sentiment tracking across social media, reviews, and support tickets",
    category: "AI & ML",
    languages: ["python", "node", "go"],
    rating: 4.3,
    installs: 1560,
    pricing: "free" as const,
    author: "SentimentAI",
    featured: false,
  },
];

const PRICING_STYLES = {
  free: { label: "Free", bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  paid: { label: "Paid", bg: "rgba(249,115,22,0.12)", color: "#f97316" },
  subscription: { label: "Pro", bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
};

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MARKETPLACE_AGENTS.filter((agent) => {
    const matchSearch =
      agent.title.toLowerCase().includes(search.toLowerCase()) ||
      agent.summary.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || agent.category === category;
    return matchSearch && matchCategory;
  });

  const featured = MARKETPLACE_AGENTS.filter((a) => a.featured);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Agent Marketplace</h1>
        <p className={styles.subtitle}>Discover, install, and deploy pre-built polyglot AI agents</p>
      </div>

      {/* Featured row */}
      <div className={styles.featuredGrid}>
        {featured.slice(0, 3).map((agent) => {
          const pricing = PRICING_STYLES[agent.pricing];
          return (
            <ForgeCard key={agent.id} variant="glow" style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}>
              <div className={styles.featuredBadge}>
                <Sparkles size={10} />
                Featured
              </div>
              <h3 className={styles.cardTitle}>{agent.title}</h3>
              <p className={styles.cardSummary}>{agent.summary}</p>
              <div className={styles.languages}>
                {agent.languages.map((lang) => (
                  <LanguageBadge key={lang} language={lang} size="sm" />
                ))}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.rating}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span className={styles.ratingValue}>{agent.rating}</span>
                  <span className={styles.installs}>({agent.installs.toLocaleString()})</span>
                </div>
                <span className={styles.pricingBadge} style={{ background: pricing.bg, color: pricing.color }}>
                  {pricing.label}
                </span>
              </div>
            </ForgeCard>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className={styles.searchFilters}>
        <div className={styles.searchContainer}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${styles.categoryButton} ${category === cat ? styles.categoryButtonActive : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className={styles.mainGrid}>
        {filtered.map((agent) => {
          const pricing = PRICING_STYLES[agent.pricing];
          return (
            <ForgeCard key={agent.id} variant="interactive" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>{agent.title}</h3>
                <span className={styles.pricingBadge} style={{ background: pricing.bg, color: pricing.color, flexShrink: 0, marginLeft: "8px" }}>
                  {agent.pricing === "paid" ? `$${(agent as { price?: number }).price}` : agent.pricing === "subscription" ? `$${(agent as { price?: number }).price}/mo` : pricing.label}
                </span>
              </div>
              <p className={styles.cardSummary}>{agent.summary}</p>
              <div className={styles.languages}>
                {agent.languages.map((lang) => (
                  <LanguageBadge key={lang} language={lang} size="sm" />
                ))}
              </div>
              <div className={styles.cardFooterLine}>
                <div className={styles.rating}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <span className={styles.ratingValue} style={{ fontSize: "11px" }}>{agent.rating}</span>
                  <span className={styles.installsIcon}>
                    <Download size={10} /> {agent.installs.toLocaleString()}
                  </span>
                </div>
                <ForgeButton variant="secondary" size="sm">
                  Install
                </ForgeButton>
              </div>
            </ForgeCard>
          );
        })}
      </div>
    </div>
  );
}
