import { AlertSummary } from "../types/alert";

interface Props {
  landscapes: string[];
  selected: string;
  onChange: (val: string) => void;
}

export function LandscapeFilter({ landscapes, selected, onChange }: Props) {
  return (
    <div className="landscape-filter">
      <label htmlFor="landscape-select">Landscape</label>
      <select
        id="landscape-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All landscapes</option>
        {landscapes.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
