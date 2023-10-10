"use client";
import { useState, useEffect } from "react";
import { Card, Title, LineChart } from "@tremor/react";
import normalizeChart from "@/utils/normalizeChart";
import { API_BASE_URL } from "@/constants";

const valueFormatter = (number: number) =>
  `Calls ${new Intl.NumberFormat("us").format(number).toString()}`;

export default () => {
  const [chartdata, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_BASE_URL + "/hello/analytics/", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setChartData(normalizeChart(data.results) as any);
      console.log(normalizeChart(data.results) as any)
    };
    fetchData();
  }, []);

  return (
    <Card>
      <Title>Export/Import Growth Rates (1970 to 2021)</Title>
      <LineChart
        className="mt-6"
        data={chartdata}
        index="created_at"
        categories={["calls", "failure", "users"]}
        colors={["emerald", "gray"]}
        valueFormatter={valueFormatter}
        yAxisWidth={70}
        showAnimation={true}
      />
    </Card>
  );
};
