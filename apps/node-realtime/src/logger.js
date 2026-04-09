const level = process.env.LOG_LEVEL ?? "info";

const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const current = levels[level] ?? 1;

function log(lvl, msg, extra) {
  if (levels[lvl] < current) return;
  const line = { ts: new Date().toISOString(), lvl, msg, ...extra };
  console[lvl === "debug" ? "log" : lvl](JSON.stringify(line));
}

export const logger = {
  debug: (msg, extra) => log("debug", msg, extra),
  info: (msg, extra) => log("info", msg, extra),
  warn: (msg, extra) => log("warn", msg, extra),
  error: (msg, extra) => log("error", msg, extra),
};
