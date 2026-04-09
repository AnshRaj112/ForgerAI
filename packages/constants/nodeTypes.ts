export const AI_NODE_TYPES = ["llm", "rag", "agent_router"] as const;
export const LOGIC_NODE_TYPES = ["trigger", "condition", "transform"] as const;
export const INTEGRATION_NODE_TYPES = ["tool", "webhook", "output"] as const;

export const NODE_TYPE_CATEGORIES = {
  ai: AI_NODE_TYPES,
  logic: LOGIC_NODE_TYPES,
  integration: INTEGRATION_NODE_TYPES,
} as const;

export const ALL_NODE_TYPES = [
  ...AI_NODE_TYPES,
  ...LOGIC_NODE_TYPES,
  ...INTEGRATION_NODE_TYPES,
] as const;

export type BuilderNodeType = (typeof ALL_NODE_TYPES)[number];
