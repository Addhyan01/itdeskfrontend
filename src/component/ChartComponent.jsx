import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {

  const data = {
    labels: ["Resolved Tickets", "Pending Tickets", "In Progress"],
    datasets: [
      {
        data: [40, 25, 15],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#3b82f6"
        ]
      }
    ]
  };

  return (
    <div style={{ width: "300px" }}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;