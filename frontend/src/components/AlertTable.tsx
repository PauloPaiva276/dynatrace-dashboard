import { useState, useMemo } from "react";
import { Alert } from "../types/alert";

const SEVERITY_COLOR: Record<string, string> = {
  AVAILABILITY: "#d32f2f",
  ERROR: "#f57c00",
  PERFORMANCE: "#fbc02d",
  RESOURCE_CONTENTION: "#7b1fa2",
  CUSTOM_ALERT: "#0288d1",
};

interface Props {
  alerts: Alert[];
}

type SortKey = "problemId" | "displayName" | "landscape" | "severityLevel" | "status" | "startTime";

export function AlertTable({ alerts }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("startTime");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    return alerts
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          a.displayName.toLowerCase().includes(q) ||
          a.problemId.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q));
        const matchStatus = !statusFilter || a.status === statusFilter;
        const matchSeverity = !severityFilter || a.severityLevel === severityFilter;
        return matchSearch && matchStatus && matchSeverity;
      })
      .sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      });
  }, [alerts, search, statusFilter, severityFilter, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  function colHeader(label: string, key: SortKey) {
    const arrow = sortKey === key ? (sortAsc ? " ▲" : " ▼") : "";
    return (
      <th onClick={() => toggleSort(key)} style={{ cursor: "pointer" }}>
        {label}{arrow}
      </th>
    );
  }

  return (
    <div className="table-card">
      <h3>Alert Table ({filtered.length})</h3>
      <div className="table-filters">
        <input
          type="text"
          placeholder="Search by name, ID, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          <option value="">All severities</option>
          <option value="AVAILABILITY">AVAILABILITY</option>
          <option value="ERROR">ERROR</option>
          <option value="PERFORMANCE">PERFORMANCE</option>
          <option value="RESOURCE_CONTENTION">RESOURCE_CONTENTION</option>
          <option value="CUSTOM_ALERT">CUSTOM_ALERT</option>
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {colHeader("ID", "problemId")}
              {colHeader("Name", "displayName")}
              {colHeader("Landscape", "landscape")}
              {colHeader("Severity", "severityLevel")}
              {colHeader("Status", "status")}
              {colHeader("Start", "startTime")}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.problemId}>
                <td><code>{a.problemId}</code></td>
                <td>{a.displayName}</td>
                <td><span className="badge landscape">{a.landscape}</span></td>
                <td>
                  <span
                    className="badge severity"
                    style={{ background: SEVERITY_COLOR[a.severityLevel] ?? "#9e9e9e" }}
                  >
                    {a.severityLevel.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span className={`badge status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>
                <td>{new Date(a.startTime).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty">No alerts match the current filters.</p>}
      </div>
    </div>
  );
}
