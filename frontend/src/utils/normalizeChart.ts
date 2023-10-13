// Calculate an hourly chart data containing distinct users,
// Number of api calls and failure for each hour from startDate to endDate

type ApiData = {
  success: boolean;
  userId: string;
  created_at: string;
} & { [key: string | number]: any }; // any other fields

export type ChartDataType = Array<{
  hour: string;
  users: number;
  calls: number;
  failure: number;
}>;

export default function normalizeChartData(data: ApiData[]): ChartDataType {
  if (!data || !data.length) return [];
  const endDate = new Date(data[0]?.created_at);
  const startDate = new Date(data[data.length - 1]?.created_at);

  // Create a map to store hourly statistics
  const hourlyStatsMap: Map<
    string,
    { users: Set<string>; calls: number; failures: number }
  > = new Map();

  // Initialize the hourlyStatsMap with empty values for each hour
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const hourKey = currentDate.toISOString().substring(0, 13); // Use the hour part as the key
    hourlyStatsMap.set(hourKey, { users: new Set(), calls: 0, failures: 0 });
    currentDate.setHours(currentDate.getHours() + 1); // Move to the next hour
  }

  // Process the data to calculate statistics
  for (const item of data) {
    const createdAt = new Date(item.created_at);
    const hourKey = createdAt.toISOString().substring(0, 13); // Use the hour part as the key

    // Count distinct users
    const hourStat = hourlyStatsMap.get(hourKey);
    if (!hourStat) continue;
    hourStat.users.add(item.userId);
    hourStat.calls++;
    if (!item.success) hourStat.failures++;
  }

  // Convert the map to an array of ChartData objects
  const chartData: ChartDataType = [];
  hourlyStatsMap.forEach((stats, hourKey) => {
    chartData.push({
      hour: hourKey,
      users: stats.users.size,
      calls: stats.calls,
      failure: stats.failures,
    });
  });

  return chartData;
}
