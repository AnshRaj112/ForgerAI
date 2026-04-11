"use client";

import {
  Cpu,
  Layers,
  Rocket,
  Activity,
  Store,
  Shield,
  Workflow,
  Globe,
} from "lucide-react";
import { ForgeCard } from "@/components/ui/forge-card";

const FEATURES = [
  {
    icon: Layers,
    title: "Visual Agent Builder",
    description: "Drag-and-drop interface powered by React Flow. Design complex multi-step AI agents without writing a single line of code.",
    color: "var(--forge-accent)",
  },
  {
    icon: Cpu,
    title: "Polyglot Compilation",
    description: "Each node automatically compiles to the optimal language — Python for AI, Rust for crypto, Go for orchestration, Java for enterprise.",
    color: "var(--lang-rust)",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy your agents instantly to any environment. Automatic containerization, scaling, and load balancing built-in.",
    color: "var(--lang-go)",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live execution tracing, performance metrics, and log streaming. See every node execute in real-time across languages.",
    color: "var(--lang-node)",
  },
  {
    icon: Store,
    title: "Agent Marketplace",
    description: "Publish, discover, and monetize AI agents. One-click install into your workspace with full customization.",
    color: "var(--lang-ruby)",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "SOC2/GDPR/HIPAA compliance, audit logging, role-based access, and full transaction history powered by Java/Spring Boot.",
    color: "var(--lang-java)",
  },
  {
    icon: Workflow,
    title: "Workflow Engine",
    description: "Complex business logic, approval processes, and human-in-the-loop steps with an elegant Ruby-powered rule engine.",
    color: "var(--lang-ruby)",
  },
  {
    icon: Globe,
    title: "CMS & Content",
    description: "Content generation, template management, and marketing automation with a mature PHP/Laravel ecosystem.",
    color: "var(--lang-php)",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--forge-accent)" }}
          >
            Platform Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to{" "}
            <span className="forge-gradient-text">Forge Intelligence</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--forge-fg-muted)" }}>
            A complete platform for building, deploying, and managing AI agents with
            the power of polyglot microservices.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ForgeCard
                key={feature.title}
                variant="interactive"
                className="group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${feature.color} 12%, transparent)`,
                    color: feature.color,
                  }}
                >
                  <Icon size={20} />
                </div>

                <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--forge-fg-muted)" }}>
                  {feature.description}
                </p>
              </ForgeCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
