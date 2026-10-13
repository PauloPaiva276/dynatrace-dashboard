import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SEVERITY_COLORS: Record<string, string> = {
  AVAILABILITY: "#d32f2f",
  ERROR: "#f57c00",
  PERFORMANCE: "#fbc02d",
  RESOURCE_CONTENTION: "#7b1fa2",
  CUSTOM_ALERT: "#0288d1",
};

interface Props {
  bySeverity: Record<string, number>;
}

export function SeverityChart({ bySeverity }: Props) {
  const data = Object.entries(bySeverity).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-card">
      <h3>Severity Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) =>
              `${name.replace("_", " ")} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={SEVERITY_COLORS[entry.name] ?? "#9e9e9e"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
