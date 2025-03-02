import React, { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const AnalysisLineBarCharts = React.memo(({ restaurants, measure, title }) => {
  // Always call hooks unconditionally
  const chartData = useMemo(() => {
    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      return null;
    }
    const labels = restaurants.map((r) => r.name);
    const dataValues = restaurants.map((r) => r[measure]);
    console.log("Chart Data:", { labels, dataValues });
    return {
      labels,
      datasets: [
        {
          label: title,
          data: dataValues,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  }, [restaurants, measure, title]);

  const options = useMemo(() => ({
    maintainAspectRatio: false,
  }), []);

  // Now conditionally return fallback UI if no valid data is available.
  if (!chartData) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        No valid data provided for the charts.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100vw", margin: "20px auto", textAlign: "center" }}>
      <h3>{title}</h3>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <div style={{ flex: 1, Width: "800px", height: "500px" }}>
          <h4>Line Chart</h4>
          <Line data={chartData} options={options} />
        </div>
        <div style={{ flex: 1, Width: "800px", height: "400px" }}>
          <h4>Bar Chart</h4>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
});

export default AnalysisLineBarCharts;
