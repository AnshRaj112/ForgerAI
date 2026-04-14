import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./platform-layout.module.css";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <AppSidebar />
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <div />
          <ThemeToggle />
        </header>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
