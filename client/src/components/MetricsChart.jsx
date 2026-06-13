import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MetricsChart({
  data,
}) {
  const darkMode =
    document.body.classList.contains(
      "dark-mode"
    );

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <LineChart
        data={data}
      >
        <CartesianGrid
          stroke={
            darkMode
              ? "#2c2c2c"
              : "#d1d5db"
          }
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="time"
          stroke={
            darkMode
              ? "#9ca3af"
              : "#374151"
          }
        />

        <YAxis
          stroke={
            darkMode
              ? "#9ca3af"
              : "#374151"
          }
        />

        <Tooltip
          contentStyle={{
            background:
              darkMode
                ? "#111827"
                : "#ffffff",
            border:
              "1px solid #ccc",
            borderRadius:
              "12px",
            color:
              darkMode
                ? "white"
                : "black",
          }}
        />

        <Line
          type="monotone"
          dataKey="cpu"
          stroke={
            darkMode
              ? "#60a5fa"
              : "#2563eb"
          }
          strokeWidth={
            3
          }
          dot={{
            r: 4,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MetricsChart;