import axios from "axios";
import { Alert, AlertSummary } from "../types/alert";

const BASE = "/api";

export async function fetchAlerts(params?: {
  landscape?: string;
  status?: string;
  severity?: string;
}): Promise<Alert[]> {
  const { data } = await axios.get<Alert[]>(`${BASE}/alerts`, { params });
  return data;
}

export async function fetchSummary(landscape?: string): Promise<AlertSummary> {
  const { data } = await axios.get<AlertSummary>(`${BASE}/alerts/summary`, {
    params: landscape ? { landscape } : {},
  });
  return data;
}

export async function fetchLandscapes(): Promise<string[]> {
  const { data } = await axios.get<string[]>(`${BASE}/landscapes`);
  return data;
}
