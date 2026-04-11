"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ForgeButton } from "@/components/ui/forge-button";
import { Sparkles, ArrowRight } from "lucide-react";

/** Animated floating particles background */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    // Seed particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.o})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        if (!pi) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          if (!pj) continue;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Radial glow behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 forge-grid-bg pointer-events-none" />

      {/* Particle canvas */}
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Tag line pill */}
        <div
          className="forge-animate-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: "var(--forge-accent-muted)",
            color: "var(--forge-accent-hover)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <Sparkles size={14} />
          <span>The Future of AI Agent Development</span>
        </div>

        {/* Headline */}
        <h1 className="forge-animate-in-delayed text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
          Build AI Agents.{" "}
          <span className="forge-gradient-text">Forge Them</span>{" "}
          in Every Language.
        </h1>

        {/* Subtitle */}
        <p
          className="forge-animate-in-delayed-2 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--forge-fg-muted)" }}
        >
          The first visual platform that automatically compiles your AI agents into
          optimized polyglot microservices — Python for AI, Rust for performance,
          Go for orchestration, and more.
        </p>

        {/* CTAs */}
        <div className="forge-animate-in-delayed-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/builder">
            <ForgeButton variant="glow" size="lg" icon={<Sparkles size={18} />}>
              Start Building
            </ForgeButton>
          </Link>
          <Link href="/marketplace">
            <ForgeButton variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
              Explore Marketplace
            </ForgeButton>
          </Link>
        </div>

        {/* Language row */}
        <div className="mt-16 forge-animate-in-delayed-3 flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: "var(--forge-fg-subtle)" }}>
          {[
            { name: "Python", color: "var(--lang-python)" },
            { name: "Rust", color: "var(--lang-rust)" },
            { name: "Go", color: "var(--lang-go)" },
            { name: "Java", color: "var(--lang-java)" },
            { name: "Ruby", color: "var(--lang-ruby)" },
            { name: "PHP", color: "var(--lang-php)" },
            { name: "Node.js", color: "var(--lang-node)" },
          ].map((lang) => (
            <div key={lang.name} className="flex items-center gap-2 font-medium">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: lang.color, boxShadow: `0 0 8px ${lang.color}` }}
              />
              {lang.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--forge-bg), transparent)" }}
      />
    </section>
  );
}
