"use client";

import { AgentCanvas } from "@/components/builder/agent-canvas";
import styles from "./builder.module.css";

export default function BuilderPage() {
  return (
    <div className={styles.container}>
      <AgentCanvas />
    </div>
  );
}
