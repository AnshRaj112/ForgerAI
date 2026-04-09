"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import {
  BackgroundVariant,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";
import type { AgentManifest, EdgeType, LanguageRuntime, NodeData, NodeType } from "@forgerai/types";
import {
  Bot,
  Boxes,
  Cable,
  Code2,
  Cpu,
  DiamondPlus,
  GitBranch,
  Hammer,
  Languages,
  Play,
  Rocket,
  Save,
  Upload,
} from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import "reactflow/dist/style.css";

type RealtimeEvent = {
  type: string;
  message: string;
  jobId: string;
  status: string;
  timestamp: string;
};

type PaletteNode = {
  id: string;
  label: string;
  category: string;
  nodeType: string;
  runtime: LanguageRuntime;
  icon: ComponentType<{ size?: number }>;
};

const runtimeOptions: LanguageRuntime[] = ["python", "rust", "go", "java", "ruby", "php", "node", "typescript"];

const paletteNodes: PaletteNode[] = [
  { id: "llm", label: "LLM Node", category: "AI Nodes", nodeType: "llm", runtime: "python", icon: Bot },
  { id: "rag", label: "RAG Node", category: "AI Nodes", nodeType: "rag", runtime: "python", icon: Boxes },
  { id: "agent", label: "Agent Router", category: "AI Nodes", nodeType: "agent_router", runtime: "go", icon: Cpu },
  { id: "condition", label: "Condition Node", category: "Logic Nodes", nodeType: "condition", runtime: "go", icon: GitBranch },
  { id: "transform", label: "Transform Node", category: "Logic Nodes", nodeType: "transform", runtime: "typescript", icon: Code2 },
  { id: "trigger", label: "Trigger Node", category: "Logic Nodes", nodeType: "trigger", runtime: "go", icon: DiamondPlus },
  { id: "tool", label: "Tool Node", category: "Integration Nodes", nodeType: "tool", runtime: "rust", icon: Hammer },
  { id: "webhook", label: "Webhook Node", category: "Integration Nodes", nodeType: "webhook", runtime: "node", icon: Cable },
  { id: "output", label: "Output Node", category: "Integration Nodes", nodeType: "output", runtime: "node", icon: Cpu },
];

const categorizedPalette = paletteNodes.reduce<Record<string, PaletteNode[]>>((acc, node) => {
  const bucket = acc[node.category] ?? [];
  bucket.push(node);
  acc[node.category] = bucket;
  return acc;
}, {});

const initialNodes: Node<NodeData>[] = [
  {
    id: "trigger",
    position: { x: 40, y: 80 },
    data: { label: "Trigger", nodeType: "trigger", language: "go", config: '{"schedule":"*/5 * * * *"}' },
    type: "input",
  },
  {
    id: "llm",
    position: { x: 300, y: 80 },
    data: { label: "LLM Processor", nodeType: "llm", language: "python", config: '{"model":"gpt-5-mini"}' },
  },
  {
    id: "output",
    position: { x: 560, y: 80 },
    data: { label: "Output", nodeType: "output", language: "node", config: '{"channel":"websocket"}' },
    type: "output",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-trigger-llm",
    source: "trigger",
    target: "llm",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-llm-output",
    source: "llm",
    target: "output",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function BuilderPage() {
  const toManifest = (graphNodes: Node<NodeData>[], graphEdges: Edge[]): AgentManifest => {
    const typedNodes: NodeType[] = graphNodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
    const typedEdges: EdgeType[] = graphEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));
    return {
      id: "draft-agent",
      name: "Draft Agent",
      versions: [],
      nodes: typedNodes,
      edges: typedEdges,
    };
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id ?? null);
  const [manifestId, setManifestId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string>("idle");
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((existing) => addEdge(connection, existing)),
    [setEdges],
  );

  const addPaletteNode = (palette: PaletteNode) => {
    const id = `${palette.id}-${Date.now()}`;
    const next: Node<NodeData> = {
      id,
      position: {
        x: 120 + nodes.length * 28,
        y: 180 + nodes.length * 18,
      },
      data: {
        label: palette.label,
        nodeType: palette.nodeType,
        language: palette.runtime,
        config: "{}",
      },
    };
    setNodes((existing) => [...existing, next]);
    setSelectedNodeId(id);
  };

  const updateSelectedNodeData = (patch: Partial<NodeData>) => {
    if (!selectedNodeId) return;
    setNodes((existing) =>
      existing.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...(node.data as NodeData),
                ...patch,
              },
            }
          : node,
      ),
    );
  };

  const manifest = useMemo(() => toManifest(nodes, edges), [nodes, edges]);

  useEffect(() => {
    const realtimeUrl = process.env.NEXT_PUBLIC_REALTIME_URL ?? "http://localhost:4010";
    const socket: Socket = io(realtimeUrl, { transports: ["websocket"] });
    socket.on("forge:event", (event: RealtimeEvent) => {
      setEvents((existing) => [event, ...existing].slice(0, 15));
      if (event.type.includes("failed")) setRunStatus("failed");
      if (event.type.includes("completed")) setRunStatus("completed");
      if (event.type.includes("started")) setRunStatus("running");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSaveManifest = async () => {
    setRunStatus("saving");
    const response = await fetch("/api/forge/manifest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(manifest),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? "Failed to save manifest");
    setManifestId(payload.manifestId);
    setRunStatus("saved");
    return payload.manifestId as string;
  };

  const handleRunAgent = async () => {
    try {
      setRunStatus("running");
      const savedManifestId = manifestId ?? (await handleSaveManifest());
      const response = await fetch("/api/forge/run-agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          manifestId: savedManifestId,
          projectId: "project-forgeai-demo",
          actorId: "user-1",
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Run Agent failed");
      setRunStatus("submitted");
    } catch (error) {
      setRunStatus("failed");
      setEvents((existing) => [
        {
          type: "job.failed",
          message: error instanceof Error ? error.message : "Run Agent failed",
          jobId: manifestId ?? "unknown",
          status: "failed",
          timestamp: new Date().toISOString(),
        },
        ...existing,
      ]);
    }
  };

  const handleCompile = async () => {
    try {
      setRunStatus("compiling");
      const savedManifestId = manifestId ?? (await handleSaveManifest());
      const response = await fetch("/api/forge/compile-manifest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          manifestId: savedManifestId,
          projectId: "project-forgeai-demo",
          actorId: "user-1",
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Compile failed");
      setRunStatus("compiled");
    } catch (error) {
      setRunStatus("failed");
      setEvents((existing) => [
        {
          type: "job.failed",
          message: error instanceof Error ? error.message : "Compile failed",
          jobId: manifestId ?? "unknown",
          status: "failed",
          timestamp: new Date().toISOString(),
        },
        ...existing,
      ]);
    }
  };

  return (
    <section className="flex h-[calc(100vh-8.5rem)] min-h-[680px] flex-col gap-4">
      <Card className="rounded-2xl">
        <CardContent className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-xl font-semibold">Agent Builder</h2>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Compose AI, logic, and integration nodes into a deployable polyglot agent.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => void handleSaveManifest()}>
              <Save size={16} />
              Save
            </Button>
            <Button variant="outline" onClick={() => void handleCompile()}>
              <Rocket size={16} />
              Compile
            </Button>
            <Button variant="outline" onClick={() => void handleRunAgent()}>
              <Play size={16} />
              Run Agent
            </Button>
            <Button>
              <Upload size={16} />
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr_330px] gap-4">
        <Card className="min-h-0 overflow-auto rounded-2xl">
          <CardHeader>
            <CardTitle>Node Palette</CardTitle>
            <CardDescription>Click to add nodes to the canvas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categorizedPalette).map(([category, nodesInCategory]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase" style={{ color: "var(--muted-foreground)" }}>
                    {category}
                  </p>
                  <Badge>{nodesInCategory.length}</Badge>
                </div>
                <div className="space-y-2">
                  {nodesInCategory.map((paletteNode) => {
                    const Icon = paletteNode.icon;
                    return (
                      <button
                        key={paletteNode.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition hover:opacity-90"
                        style={{ borderColor: "var(--border)", background: "var(--background)" }}
                        onClick={() => addPaletteNode(paletteNode)}
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={16} />
                          {paletteNode.label}
                        </span>
                        <Badge>{paletteNode.runtime}</Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Canvas</CardTitle>
              <Badge>{manifest.nodes.length} nodes</Badge>
            </div>
            <CardDescription>Drag, connect, and tune your workflow graph.</CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-4.5rem)] p-0">
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
            >
              <MiniMap />
              <Controls />
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
          </CardContent>
        </Card>

        <Card className="min-h-0 overflow-auto rounded-2xl">
          <CardHeader>
            <CardTitle>Node Inspector</CardTitle>
            <CardDescription>Properties, runtime, and configuration.</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedNode ? (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Select a node on the canvas to edit settings.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="node-label">Label</Label>
                  <Input
                    id="node-label"
                    value={(selectedNode.data as NodeData).label}
                    onChange={(event) => updateSelectedNodeData({ label: event.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="node-type">Node Type</Label>
                  <Input
                    id="node-type"
                    value={(selectedNode.data as NodeData).nodeType}
                    onChange={(event) => updateSelectedNodeData({ nodeType: event.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="node-runtime">Language</Label>
                  <Select
                    id="node-runtime"
                    value={(selectedNode.data as NodeData).language}
                    onChange={(event) => updateSelectedNodeData({ language: event.target.value as LanguageRuntime })}
                  >
                    {runtimeOptions.map((runtime) => (
                      <option key={runtime} value={runtime}>
                        {runtime[0]?.toUpperCase()}
                        {runtime.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="node-config">Configuration (JSON)</Label>
                  <Textarea
                    id="node-config"
                    value={(selectedNode.data as NodeData).config}
                    onChange={(event) => updateSelectedNodeData({ config: event.target.value })}
                    className="min-h-32 font-mono text-xs"
                  />
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs uppercase" style={{ color: "var(--muted-foreground)" }}>
                    Metadata
                  </p>
                  <div className="rounded-lg border p-3 text-xs" style={{ borderColor: "var(--border)" }}>
                    <p className="mb-1">Node ID: {selectedNode.id}</p>
                    <p className="flex items-center gap-1">
                      <Languages size={12} />
                      Runtime: {(selectedNode.data as NodeData).language}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Execution Status</CardTitle>
            <Badge>{runStatus}</Badge>
          </div>
          <CardDescription>Live updates from node-realtime websocket stream.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              No execution events yet.
            </p>
          ) : (
            events.map((event) => (
              <div key={`${event.jobId}-${event.timestamp}-${event.type}`} className="rounded-md border p-2 text-xs" style={{ borderColor: "var(--border)" }}>
                <div className="mb-1 flex items-center justify-between">
                  <strong>{event.type}</strong>
                  <span style={{ color: "var(--muted-foreground)" }}>{event.status}</span>
                </div>
                <p>{event.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
