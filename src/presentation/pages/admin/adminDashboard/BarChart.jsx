import React from "react";
import Chart from "react-apexcharts";

export default function BarChart() {
    const options = {
        chart: { type: "bar" },
        xaxis: {
            categories: ["BTC", "DOGE", "SOL", "ETH", "XRP", "USDC"],
        },
        colors: ["#6366F1", "#34D399", "#000", "#6366F1", "#A5B4FC", "#34D399"],
    };

    const series = [{ name: "Traffic", data: [12000, 22000, 18000, 30000, 9000, 20000] }];

    return <Chart options={options} series={series} type="bar" height={250} />;
}
