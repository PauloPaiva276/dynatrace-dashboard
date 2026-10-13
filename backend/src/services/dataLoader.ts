import fs from "fs";
import path from "path";
import { Alert, AlertSummary, TimelinePoint } from "../types/alert";

const DATA_DIR = path.join(__dirname, "../../data");

let cachedAlerts: Alert[] | null = null;

export function loadAlerts(): Alert[] {
  if (cachedAlerts) return cachedAlerts;

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const all: Alert[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const alerts: Alert[] = JSON.parse(raw);
    all.push(...alerts);
  }

  cachedAlerts = all;
  return all;
}

export function invalidateCache(): void {
  cachedAlerts = null;
}

export function getAlerts(filters: {
  landscape?: string;
  status?: string;
  severity?: string;
}): Alert[] {
  let alerts = loadAlerts();

  if (filters.landscape) {
    alerts = alerts.filter((a) => a.landscape === filters.landscape);
  }
  if (filters.status) {
    alerts = alerts.filter(
      (a) => a.status === filters.status?.toUpperCase()
    );
  }
  if (filters.severity) {
    alerts = alerts.filter(
      (a) => a.severityLevel === filters.severity?.toUpperCase()
    );
  }

  return alerts;
}

export function getSummary(landscapeFilter?: string): AlertSummary {
  const alerts = landscapeFilter
    ? getAlerts({ landscape: landscapeFilter })
    : loadAlerts();

  const byLandscape: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byDate: Record<string, { open: number; resolved: number }> = {};

  for (const alert of alerts) {
    byLandscape[alert.landscape] = (byLandscape[alert.landscape] ?? 0) + 1;
    bySeverity[alert.severityLevel] = (bySeverity[alert.severityLevel] ?? 0) + 1;
    byStatus[alert.status] = (byStatus[alert.status] ?? 0) + 1;

    const date = new Date(alert.startTime).toISOString().slice(0, 10);
    if (!byDate[date]) byDate[date] = { open: 0, resolved: 0 };
    if (alert.status === "OPEN") byDate[date].open++;
    else byDate[date].resolved++;
  }

  const timeline: TimelinePoint[] = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));

  return { byLandscape, bySeverity, byStatus, timeline };
}

export function getLandscapes(): string[] {
  const alerts = loadAlerts();
  return [...new Set(alerts.map((a) => a.landscape))].sort();
}
