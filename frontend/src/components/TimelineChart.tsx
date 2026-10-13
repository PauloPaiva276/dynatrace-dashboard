import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TimelinePoint } from "../types/alert";

interface Props {
  timeline: TimelinePoint[];
}

export function TimelineChart({ timeline }: Props) {
  return (
    <div className="chart-card">
      <h3>Alert Timeline</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={timeline}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="open"
            stroke="#d32f2f"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#388e3c"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
