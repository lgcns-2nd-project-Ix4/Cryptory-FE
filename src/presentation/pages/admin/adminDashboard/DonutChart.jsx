import React from "react";
import Chart from "react-apexcharts";

export default function DonutChart() {
    const options = {
        labels: ["사용량", "사용 가능"],
        colors: ["#6366F1", "#1F2937"],
    };

    const series = [52.1, 47.9];

    return <Chart options={options} series={series} type="donut" height={250} />;
}
