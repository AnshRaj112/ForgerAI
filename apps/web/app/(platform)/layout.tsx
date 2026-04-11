import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--forge-bg)", color: "var(--forge-fg)" }}>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-14 items-center justify-between border-b px-6 shrink-0"
          style={{ borderColor: "var(--forge-border)", background: "var(--forge-bg-subtle)" }}
        >
          <div />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
