import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalysisPieChartRestaurant = React.memo(({ restaurants, measure, title }) => {
  // Always call hooks unconditionally
  const chartData = useMemo(() => {
    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      return null;
    }
    const labels = restaurants.map((r) => r.name);
    const dataValues = restaurants.map((r) => r[measure]);
    console.log("Pie Chart Data:", { labels, dataValues });
    return {
      labels,
      datasets: [
        {
          label: title,
          data: dataValues,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  }, [restaurants, measure, title]);

  const options = useMemo(() => ({
    maintainAspectRatio: false,
  }), []);

  // If no valid data, display a fallback message.
  if (!chartData) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        No valid data provided for the chart.
      </div>
    );
  }

  // Ensure the container has fixed dimensions so the chart is visible.
  return (
    <div style={{ maxWidth: "500px", height: "300px", margin: "60px auto", textAlign: "center" }}>
      <h3>{title}</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
});

export default AnalysisPieChartRestaurant;
