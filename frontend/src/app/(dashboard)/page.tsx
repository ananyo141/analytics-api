"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Title,
  LineChart,
  DonutChart,
  BarChart,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { useAtomValue, useAtom } from "jotai";
import { addDays, subDays, format } from "date-fns";
import { useRouter } from "next/navigation";

import normalizeChart, { type ChartDataType } from "@/utils/normalizeChart";
import { tokenAtom, isAuthAtom, clearStorage } from "@/state/userAtoms";
import { API_BASE_URL } from "@/constants";

import ApiHitButton from "./ApiHitButton";
import LogTable, { type ApiLogType } from "./LogTable";

interface StatsType {
  total_calls: number;
  total_fails: number;
  total_users: number;
}

export default () => {
  const isAuthenticated = useAtomValue(isAuthAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const router = useRouter();

  const dateNow = new Date();

  const [page, setPage] = useState(1);
  const [buttonLoader, setButtonLoader] = useState({
    left: false,
    right: false,
  });
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: subDays(dateNow, 7), // default to last 7 days
    to: addDays(dateNow, 1),
  });

  const [chartdata, setChartData] = useState<ChartDataType>([]);
  const [tableData, setTableData] = useState<ApiLogType>([]);
  const [statsData, setStatsData] = useState<StatsType>({
    total_calls: 0,
    total_fails: 0,
    total_users: 0,
  });

  const handleLogout = () => {
    clearStorage();
    setToken("");
    router.replace("/login");
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    const res = await fetch(
      API_BASE_URL +
        `/hello/analytics/?page=${page}&time_range=custom&start_date=${format(
          dateRange.from ?? dateNow,
          "dd-MM-yyyy"
        )}&end_date=${format(dateRange.to ?? dateNow, "dd-MM-yyyy")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 }, // invalidate cache every minute
      }
    );
    const data = await res.json();

    setTableData(data.results);
    setStatsData({
      total_calls: data.count,
      total_fails: data.failure_count,
      total_users: data.distinct_users,
    });
    setChartData(normalizeChart(data.results as ApiLogType));
    setButtonLoader({ left: false, right: false });
  };

  useEffect(() => {
    fetchData();
  }, [token, dateRange, page]);

  if (!isAuthenticated) return router.replace("/login");

  return (
    <>
      <div className="flex my-7 flex-col xl:flex-row xl:items-center justify-center gap-2 xl:gap-5">
        <DateRangePicker
          className="max-w-md"
          value={dateRange}
          onValueChange={setDateRange}
          selectPlaceholder="Select Range"
          color="rose"
        >
          <DateRangePickerItem value="last_24_hours" from={subDays(dateNow, 1)}>
            Last 24 hours
          </DateRangePickerItem>
          <DateRangePickerItem
            value="last_7_days"
            from={subDays(dateNow, 7)}
            to={dateNow}
          >
            Last 7 days
          </DateRangePickerItem>
          <DateRangePickerItem
            value="custom"
            from={subDays(dateNow, 7)}
            to={dateNow}
          >
            Custom
          </DateRangePickerItem>
        </DateRangePicker>
        <ApiHitButton onClick={fetchData} />
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Card>
        <Title className="text-center">
          API Analytics
          {dateRange.from &&
            dateRange.to &&
            " (" +
              format(dateRange.from ?? dateNow, "dd MMM") +
              " to " +
              format(dateRange.to ?? dateNow, "dd MMM") +
              ")"}
        </Title>
        <div className="flex flex-col md:flex-row-reverse items-center gap-5 py-4 justify-center">
          <DonutChart
            className="w-1/2 h-72"
            showAnimation={true}
            data={[
              {
                name: "Success",
                value: statsData.total_calls - statsData.total_fails,
              },
              { name: "Fails", value: statsData.total_fails },
            ]}
            category="value"
            index="name"
            valueFormatter={(value) => value.toString() + " total"}
            colors={["indigo", "rose"]}
          />
          <BarChart
            className="max-w-xl"
            showAnimation={true}
            data={[
              { name: "Total Calls", count: statsData.total_calls },
              {
                name: "Total Success",
                count: statsData.total_calls - statsData.total_fails,
              },
              { name: "Total Fails", count: statsData.total_fails },
              { name: "Total Users", count: statsData.total_users },
            ]}
            index="name"
            showLegend={false}
            categories={["count"]}
            colors={["cyan"]}
            valueFormatter={(value) => value.toString() + " total"}
          />
        </div>
        <Title className="mt-6 text-center">Hourly Analytics</Title>
        <LineChart
          data={chartdata}
          index="hour"
          categories={["calls", "failure", "users"]}
          colors={["emerald", "red", "gray"]}
          valueFormatter={(value) => value.toString()}
          yAxisWidth={70}
          showAnimation={true}
        />
      </Card>
      <LogTable data={tableData} />

      <div className="flex items-center p-4 justify-end gap-5">
        <Button
          className="border"
          loading={buttonLoader.left}
          disabled={page === 1 || (page === 1 && chartdata.length === 0)}
          onClick={() => {
            setButtonLoader({ left: true, right: false });
            setPage(page - 1);
          }}
        >
          &lt;&lt; Prev Page
        </Button>
        <Button
          className="border"
          loading={buttonLoader.right}
          disabled={chartdata.length === 0}
          onClick={() => {
            setButtonLoader({ left: false, right: true });
            setPage(page + 1);
          }}
        >
          Next Page &gt;&gt;
        </Button>
      </div>
    </>
  );
};
