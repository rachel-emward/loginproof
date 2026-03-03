"use client";

import "chart.js/auto";
import { Line } from "react-chartjs-2";

// Deterministic ticker-style series: random walk from 100 with slight uptrend
function generateTickerData(): number[] {
  const points = 45;
  const data: number[] = [100];
  let u = 0.42;
  for (let i = 1; i < points; i++) {
    u = (u * 9301 + 49297) % 233280;
    const r = u / 233280;
    const drift = 0.06;
    const volatility = 0.55;
    const change = drift + (r - 0.5) * volatility;
    const next = Math.max(94, Math.min(116, data[i - 1] + change));
    data.push(Math.round(next * 100) / 100);
  }
  return data;
}

const tickerData = generateTickerData();
const chartStart = tickerData[0];
const chartEnd = tickerData[tickerData.length - 1];
const chartPct =
  chartStart === 0
    ? 0
    : (((chartEnd - chartStart) / chartStart) * 100).toFixed(1);
const chartPctSign = Number(chartPct) >= 0 ? "+" : "";
const labels = tickerData.map((_, i) => {
  const d = new Date(2025, 0, 6 + i);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

const chartData = {
  labels,
  datasets: [
    {
      label: "Price",
      data: tickerData,
      borderColor: "rgb(217 119 6)", // amber-600
      backgroundColor: "rgba(217, 119, 6, 0.08)",
      fill: true,
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#1e3a8a",
        font: { size: 10 },
        maxTicksLimit: 8,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.08)",
      },
      ticks: {
        color: "#1e3a8a",
        font: { size: 11 },
        callback: (value: number) => "$" + value,
      },
    },
  },
};

export function DashboardChart() {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-serif text-2xl font-semibold text-blue-950">
          ${chartEnd.toFixed(2)}
        </span>
        <span
          className={
            Number(chartPct) >= 0
              ? "text-sm font-medium text-emerald-700"
              : "text-sm font-medium text-red-700"
          }
        >
          {chartPctSign}
          {chartPct}% since Jan 6
        </span>
      </div>
      <div className="h-[220px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
