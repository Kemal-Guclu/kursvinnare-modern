"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export function ChartSection() {
  const data = {
    labels: ["Mån", "Tis", "Ons", "Tor", "Fre"],
    datasets: [
      {
        label: "BTC/USD",
        data: [67000, 67500, 68000, 68500, 69000],
        borderColor: "rgb(37, 99, 235)", // blå
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">
        Exempelgraf: Bitcoin (BTC/USD)
      </h3>
      <Line data={data} options={options} />
    </section>
  );
}
