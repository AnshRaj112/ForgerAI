"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { NodePalette } from "@/components/builder/node-palette";
import { PropertiesPanel } from "@/components/builder/properties-panel";
import { BuilderToolbar } from "@/components/builder/toolbar";
import { LlmNode } from "@/components/builder/custom-nodes/llm-node";
import { RagNode } from "@/components/builder/custom-nodes/rag-node";
import { ToolNode } from "@/components/builder/custom-nodes/tool-node";
import { ConditionNode } from "@/components/builder/custom-nodes/condition-node";
import { TriggerNode } from "@/components/builder/custom-nodes/trigger-node";
import { TransformNode } from "@/components/builder/custom-nodes/transform-node";
import { WebhookNode } from "@/components/builder/custom-nodes/webhook-node";
import { OutputNode } from "@/components/builder/custom-nodes/output-node";
import { AgentRouterNode } from "@/components/builder/custom-nodes/agent-router-node";

const INITIAL_NODES: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 250, y: 50 },
    data: { label: "API Trigger", nodeType: "trigger", language: "go", config: "{}" },
  },
  {
    id: "llm-1",
    type: "llm",
    position: { x: 250, y: 200 },
    data: { label: "GPT-4o", nodeType: "llm", language: "python", config: '{"model":"gpt-4o","temperature":0.7}' },
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 250, y: 380 },
    data: { label: "JSON Response", nodeType: "output", language: "node", config: '{"format":"json"}' },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e-trigger-llm", source: "trigger-1", target: "llm-1", animated: true, style: { stroke: "rgba(99,102,241,0.5)" } },
  { id: "e-llm-output", source: "llm-1", target: "output-1", animated: true, style: { stroke: "rgba(99,102,241,0.5)" } },
];

export function AgentCanvas() {
  const nodeTypes = useMemo(
    () => ({
      llm: LlmNode,
      rag: RagNode,
      tool: ToolNode,
      condition: ConditionNode,
      trigger: TriggerNode,
      transform: TransformNode,
      webhook: WebhookNode,
      output: OutputNode,
      agent_router: AgentRouterNode,
    }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("My First Agent");
  const [paletteOpen, setPaletteOpen] = useState(true);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "rgba(99,102,241,0.5)" } },
          eds,
        ),
      ),
    [setEdges],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  /** Add node from palette via drop or click */
  const addNode = useCallback(
    (type: string, label: string, language: string) => {
      const id = `${type}-${Date.now()}`;
      const newNode: Node = {
        id,
        type,
        position: {
          x: 200 + Math.random() * 200,
          y: 100 + nodes.length * 80 + Math.random() * 60,
        },
        data: { label, nodeType: type, language, config: "{}" },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
    },
    [nodes.length, setNodes],
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
      );
    },
    [setNodes],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges],
  );

  return (
    <div className="flex h-full w-full">
      {/* Left: Node Palette */}
      {paletteOpen && (
        <div
          className="w-64 shrink-0 border-r overflow-y-auto"
          style={{
            background: "var(--forge-bg-subtle)",
            borderColor: "var(--forge-border)",
          }}
        >
          <NodePalette onAddNode={addNode} />
        </div>
      )}

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <BuilderToolbar
          agentName={agentName}
          onAgentNameChange={setAgentName}
          nodeCount={nodes.length}
          edgeCount={edges.length}
          paletteOpen={paletteOpen}
          onTogglePalette={() => setPaletteOpen((v) => !v)}
          nodes={nodes}
          edges={edges}
        />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{
              background: "var(--forge-bg)",
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(99,102,241,0.08)"
            />
            <Controls
              style={{
                background: "var(--forge-bg-elevated)",
                border: "1px solid var(--forge-border)",
                borderRadius: "12px",
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                const langColors: Record<string, string> = {
                  python: "#3b82f6",
                  rust: "#f97316",
                  go: "#06b6d4",
                  java: "#ef4444",
                  ruby: "#ec4899",
                  php: "#8b5cf6",
                  node: "#22c55e",
                  typescript: "#3b82f6",
                };
                return langColors[node.data?.language as string] ?? "#6366f1";
              }}
              style={{
                background: "var(--forge-bg-muted)",
                border: "1px solid var(--forge-border)",
                borderRadius: "12px",
              }}
              maskColor="rgba(9,9,11,0.7)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right: Properties Panel */}
      {selectedNode && (
        <div
          className="w-80 shrink-0 border-l overflow-y-auto"
          style={{
            background: "var(--forge-bg-subtle)",
            borderColor: "var(--forge-border)",
          }}
        >
          <PropertiesPanel
            node={selectedNode}
            onUpdateData={(data) => updateNodeData(selectedNode.id, data)}
            onDelete={() => deleteNode(selectedNode.id)}
          />
        </div>
      )}
    </div>
  );
}
