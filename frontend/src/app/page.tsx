"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Title,
  LineChart,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { useAtomValue } from "jotai";
import { subDays, format } from "date-fns";

import normalizeChart from "@/utils/normalizeChart";
import { userAtom } from "@/state/userAtoms";
import { API_BASE_URL } from "@/constants";

export default () => {
  const user = useAtomValue(userAtom);
  const dateNow = new Date();

  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: subDays(dateNow, 1),
    to: dateNow,
  });

  const [chartdata, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user.isAuthenticated) return;
      const res = await fetch(
        API_BASE_URL +
          `/hello/analytics/?page=${page}&time_range=custom&start_date=${format(
            dateRange.from ?? dateNow,
            "dd-MM-yyyy",
          )}&end_date=${format(dateRange.to ?? dateNow, "dd-MM-yyyy")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          next: { revalidate: 60 }, // invalidate cache every minute
        },
      );
      const data = await res.json();

      setChartData(normalizeChart(data.results) as any);
    };
    fetchData();
  }, [user.accessToken, dateRange, page]);

  return (
    <>
      <DateRangePicker
        className="max-w-md mx-auto"
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
      <Card>
        <Title>
          API Analytics
          {dateRange.from &&
            dateRange.to &&
            " (" +
              format(dateRange.from ?? dateNow, "dd MMM") +
              " to " +
              format(dateRange.to ?? dateNow, "dd MMM") +
              ")"}
        </Title>
        <LineChart
          className="mt-6"
          data={chartdata}
          index="hour"
          categories={["calls", "failure", "users"]}
          colors={["emerald", "red", "gray"]}
          valueFormatter={(value) => value.toString()}
          yAxisWidth={70}
          showAnimation={true}
        />
      </Card>
      <Button
        className="mt-6 mr-2"
        onClick={() => setPage(page > 1 ? page - 1 : 1)}
      >
        &lt;&lt; Prev Page
      </Button>
      <Button className="mt-6" onClick={() => setPage(page + 1)}>
        Next Page &gt;&gt;
      </Button>
    </>
  );
};
