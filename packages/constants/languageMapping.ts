import type { LanguageRuntime } from "@forgerai/types";
import type { BuilderNodeType } from "./nodeTypes";

export const NODE_LANGUAGE_MAPPING: Record<BuilderNodeType, LanguageRuntime> = {
  llm: "python",
  rag: "python",
  agent_router: "go",
  trigger: "go",
  condition: "go",
  transform: "typescript",
  tool: "rust",
  webhook: "node",
  output: "node",
};

export const getBestLanguageForNode = (nodeType: BuilderNodeType): LanguageRuntime =>
  NODE_LANGUAGE_MAPPING[nodeType];
