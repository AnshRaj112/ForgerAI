import { Button } from "@/components/ui/button";

export default function MarketplacePage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Marketplace</h2>
      <p style={{ color: "var(--muted-foreground)" }}>
        Discover reusable agent templates, tools, and workflow blocks.
      </p>
      <div className="rounded-md border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <h3 className="mb-2 text-lg font-medium">Starter Packs</h3>
        <p className="mb-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Marketplace indexing and install flow can be connected next.
        </p>
        <Button>Browse Packs</Button>
      </div>
    </section>
  );
}
