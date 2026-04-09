export default function DeploymentsPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Deployments</h2>
      <p style={{ color: "var(--muted-foreground)" }}>
        Track releases, runtime targets, and environment status across services.
      </p>
      <div className="rounded-md border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Deployment table and history timeline can be wired to `/api/forge/status`.
        </p>
      </div>
    </section>
  );
}
