import { useEffect, useState } from "react";
import { fetchAlerts, fetchLandscapes, fetchSummary } from "./api/client";
import { Alert, AlertSummary } from "./types/alert";
import { LandscapeFilter } from "./components/LandscapeFilter";
import { LandscapeChart } from "./components/LandscapeChart";
import { SeverityChart } from "./components/SeverityChart";
import { TimelineChart } from "./components/TimelineChart";
import { AlertTable } from "./components/AlertTable";
import "./App.css";

function App() {
  const [landscapes, setLandscapes] = useState<string[]>([]);
  const [selectedLandscape, setSelectedLandscape] = useState("");
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLandscapes()
      .then(setLandscapes)
      .catch(() => setError("Failed to load landscapes"));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchSummary(selectedLandscape || undefined),
      fetchAlerts(selectedLandscape ? { landscape: selectedLandscape } : {}),
    ])
      .then(([s, a]) => {
        setSummary(s);
        setAlerts(a);
      })
      .catch(() => setError("Failed to load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [selectedLandscape]);

  return (
    <div className="app">
      <header className="header">
        <h1>Dynatrace Alert Dashboard</h1>
        <LandscapeFilter
          landscapes={landscapes}
          selected={selectedLandscape}
          onChange={setSelectedLandscape}
        />
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        summary && (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <span className="stat-value">{alerts.length}</span>
                <span className="stat-label">Total Alerts</span>
              </div>
              <div className="stat-card open">
                <span className="stat-value">{summary.byStatus["OPEN"] ?? 0}</span>
                <span className="stat-label">Open</span>
              </div>
              <div className="stat-card resolved">
                <span className="stat-value">{summary.byStatus["RESOLVED"] ?? 0}</span>
                <span className="stat-label">Resolved</span>
              </div>
              <div className="stat-card landscapes-count">
                <span className="stat-value">{landscapes.length}</span>
                <span className="stat-label">Landscapes</span>
              </div>
            </div>

            <div className="charts-row">
              <LandscapeChart byLandscape={summary.byLandscape} />
              <SeverityChart bySeverity={summary.bySeverity} />
              <TimelineChart timeline={summary.timeline} />
            </div>

            <AlertTable alerts={alerts} />
          </>
        )
      )}
    </div>
  );
}

export default App;
