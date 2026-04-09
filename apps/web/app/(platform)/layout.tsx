import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-14 items-center justify-end border-b px-4"
          style={{ borderColor: "var(--border)", background: "var(--background)" }}
        >
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
