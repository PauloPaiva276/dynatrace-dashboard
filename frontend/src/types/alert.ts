export type SeverityLevel =
  | "AVAILABILITY"
  | "ERROR"
  | "PERFORMANCE"
  | "RESOURCE_CONTENTION"
  | "CUSTOM_ALERT";

export type Status = "OPEN" | "RESOLVED";

export interface Alert {
  problemId: string;
  displayName: string;
  status: Status;
  severityLevel: SeverityLevel;
  impactLevel: string;
  startTime: number;
  endTime: number | null;
  affectedEntities: string[];
  landscape: string;
  tags: string[];
}

export interface AlertSummary {
  byLandscape: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  timeline: TimelinePoint[];
}

export interface TimelinePoint {
  date: string;
  open: number;
  resolved: number;
}
