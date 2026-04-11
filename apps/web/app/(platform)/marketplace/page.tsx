"use client";

import { useState } from "react";
import { ForgeCard } from "@/components/ui/forge-card";
import { ForgeButton } from "@/components/ui/forge-button";
import { LanguageBadge } from "@/components/ui/language-badge";
import { Search, Star, Download, Filter, ArrowUpDown, Sparkles } from "lucide-react";

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
  free: { label: "Free", bg: "rgba(34,197,94,0.12)", color: "var(--forge-success)" },
  paid: { label: "Paid", bg: "rgba(249,115,22,0.12)", color: "var(--lang-rust)" },
  subscription: { label: "Pro", bg: "rgba(139,92,246,0.12)", color: "var(--lang-php)" },
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--forge-fg)" }}>
          Agent Marketplace
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--forge-fg-muted)" }}>
          Discover, install, and deploy pre-built polyglot AI agents
        </p>
      </div>

      {/* Featured row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.slice(0, 3).map((agent) => {
          const pricing = PRICING_STYLES[agent.pricing];
          return (
            <ForgeCard key={agent.id} variant="glow" className="relative overflow-hidden group cursor-pointer">
              <div
                className="absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold rounded-bl-lg flex items-center gap-1"
                style={{ background: "var(--forge-accent-muted)", color: "var(--forge-accent)" }}
              >
                <Sparkles size={10} />
                Featured
              </div>
              <h3 className="text-sm font-semibold mb-2 mt-2" style={{ color: "var(--forge-fg)" }}>
                {agent.title}
              </h3>
              <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--forge-fg-muted)" }}>
                {agent.summary}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.languages.map((lang) => (
                  <LanguageBadge key={lang} language={lang} size="sm" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: "var(--forge-warning)", fill: "var(--forge-warning)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>{agent.rating}</span>
                  <span className="text-[10px] ml-1" style={{ color: "var(--forge-fg-subtle)" }}>
                    ({agent.installs.toLocaleString()})
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: pricing.bg, color: pricing.color }}>
                  {pricing.label}
                </span>
              </div>
            </ForgeCard>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--forge-fg-subtle)" }} />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{
              background: "var(--forge-bg-elevated)",
              border: "1px solid var(--forge-border)",
              color: "var(--forge-fg)",
            }}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
              style={{
                background: category === cat ? "var(--forge-accent-muted)" : "transparent",
                color: category === cat ? "var(--forge-accent)" : "var(--forge-fg-muted)",
                border: `1px solid ${category === cat ? "rgba(99,102,241,0.3)" : "var(--forge-border)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((agent) => {
          const pricing = PRICING_STYLES[agent.pricing];
          return (
            <ForgeCard key={agent.id} variant="interactive" className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold" style={{ color: "var(--forge-fg)" }}>
                  {agent.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2" style={{ background: pricing.bg, color: pricing.color }}>
                  {agent.pricing === "paid" ? `$${(agent as { price?: number }).price}` : agent.pricing === "subscription" ? `$${(agent as { price?: number }).price}/mo` : pricing.label}
                </span>
              </div>
              <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color: "var(--forge-fg-muted)" }}>
                {agent.summary}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.languages.map((lang) => (
                  <LanguageBadge key={lang} language={lang} size="sm" />
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid var(--forge-border-muted)" }}>
                <div className="flex items-center gap-2">
                  <Star size={11} style={{ color: "var(--forge-warning)", fill: "var(--forge-warning)" }} />
                  <span className="text-[11px] font-medium" style={{ color: "var(--forge-fg)" }}>{agent.rating}</span>
                  <span className="text-[10px] flex items-center gap-0.5" style={{ color: "var(--forge-fg-subtle)" }}>
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
