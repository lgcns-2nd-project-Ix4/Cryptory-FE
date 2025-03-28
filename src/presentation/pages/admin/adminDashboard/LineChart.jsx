import React from "react";
import Chart from "react-apexcharts";

export default function LineChart() {
    const options = {
        chart: { type: "line" },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
    };

    const series = [
        { name: "Users", data: [10000, 15000, 12000, 18000, 20000, 25000, 28000] },
        { name: "Visitors", data: [8000, 12000, 9000, 14000, 17000, 21000, 26000] },
    ];

    return <Chart options={options} series={series} type="line" height={250} />;
}
