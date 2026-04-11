import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ForgeAI — Polyglot AI Agent Forge & Marketplace",
  description:
    "Build powerful AI agents visually with drag-and-drop, automatically compiled into optimized polyglot microservices. Python for AI, Rust for performance, Go for orchestration.",
  keywords: [
    "AI agents",
    "polyglot",
    "no-code",
    "agent builder",
    "LangChain",
    "microservices",
    "marketplace",
  ],
  openGraph: {
    title: "ForgeAI — Polyglot AI Agent Forge & Marketplace",
    description:
      "The first visual platform that compiles AI agents into optimized polyglot microservices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
