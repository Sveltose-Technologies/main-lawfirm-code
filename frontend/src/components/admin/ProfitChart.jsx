import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProfitChart = () => {
  const chartoptions = {
    series: [
      {
        name: "Previous",
        data: [100, 600, 5500, 3000, 200],
      },
      {
        name: "Current",
        data: [600, 5500, 3200, 200, 1300],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 250,
        toolbar: { show: false },
      },
      colors: ["#eebb5d", "#002147"], 
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 4,
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Sat"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#a1aab2" } },
      },
      yaxis: { labels: { style: { colors: "#a1aab2" } } },
      fill: { opacity: 1 },
      tooltip: { theme: "dark" },
      legend: { position: "bottom", markers: { radius: 12 } },
      grid: { borderColor: "#f1f1f1" },
    },
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 mb-4">
      <CardBody>
        <CardTitle
          tag="h5"
          className="fw-bold mb-4"
          style={{ borderLeft: "4px solid #eebb5d", paddingLeft: "10px" }}>
          Profit Earned
        </CardTitle>
        <div className="mt-2">
          <Chart
            options={chartoptions.options}
            series={chartoptions.series}
            type="bar"
            height="250"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfitChart;
