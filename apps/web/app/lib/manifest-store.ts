import { randomUUID } from "node:crypto";
import type { AgentManifest } from "@forgerai/types";

export type StoredManifest = {
  manifestId: string;
  manifest: AgentManifest;
  createdAt: string;
};

const manifests = new Map<string, StoredManifest>();

export const saveManifest = (manifest: AgentManifest): StoredManifest => {
  const stored: StoredManifest = {
    manifestId: randomUUID(),
    manifest,
    createdAt: new Date().toISOString(),
  };
  manifests.set(stored.manifestId, stored);
  return stored;
};

export const getManifest = (manifestId: string): StoredManifest | undefined => manifests.get(manifestId);
