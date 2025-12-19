"use client";

import { GetInformationDashoardResponse } from "@/app/dto/dashboard-dto";
import { CardDashboard } from "@/components/dashboard/card-dashboard";
import { FilterDashboardButton } from "@/components/dashboard/filter-dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQueryData } from "@/utils/tanstack";

import { ConvertRupiah } from "@/utils/utils";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  income: {
    label: "Pendapatan",
    color: "var(--chart-1)",
  },
  expend: {
    label: "Pengeluaran",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function DasboardPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [lastDate, setLastDate] = useState<string>("");

  const buildDashboardUrl = (start?: string, last?: string) => {
    const params = new URLSearchParams();

    if (start) params.append("start", start);
    if (last) params.append("last", last);

    return `/dashboard${params.toString() ? `?${params}` : ""}`;
  };

  const { data } = useQueryData(
    [startDate, lastDate],
    buildDashboardUrl(startDate, lastDate)
  );

  const dashboard: GetInformationDashoardResponse = data?.data;

  const [timeRange] = useState("30d");
  const filteredData = useMemo(() => {
    if (!dashboard?.chart_income_expends?.length) return [];

    if (startDate && lastDate) {
      const start = DateTime.fromISO(startDate).startOf("day");
      const end = DateTime.fromISO(lastDate).endOf("day");

      return dashboard.chart_income_expends.filter((item) => {
        const itemDate = DateTime.fromISO(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    let days = 90;
    if (timeRange === "30d") days = 30;
    else if (timeRange === "7d") days = 7;

    const referenceDate = DateTime.fromISO(
      dashboard.chart_income_expends.at(-1)!.date
    );

    const start = referenceDate.minus({ days });

    return dashboard.chart_income_expends.filter((item) => {
      const itemDate = DateTime.fromISO(item.date);
      return itemDate >= start && itemDate <= referenceDate;
    });
  }, [dashboard, timeRange, startDate, lastDate]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <FilterDashboardButton
          setLastDate={setLastDate}
          setStartDate={setStartDate}
        />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <CardDashboard
          description="Total Pendapatan"
          title={ConvertRupiah(dashboard?.income!)}
        />
        <CardDashboard
          description="Total Pengeluaran"
          title={ConvertRupiah(dashboard?.expend!)}
        />
        <CardDashboard
          description="Total Orderan Dibuat"
          title={dashboard?.total_order.toString()!}
        />
        <CardDashboard
          description="Total Orderan Diselesaikan"
          title={dashboard?.total_finished_order.toString()!}
        />
      </div>
      <div className="w-full">
        <Card className="pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Grafik pendapatan dan pengeluaran</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-income)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-income)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpend" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-expend)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-expend)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      formatter={(value) => {
                        return ConvertRupiah(Number(value));
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="income"
                  type="natural"
                  fill="url(#fillIncome)"
                  stroke="var(--color-income)"
                />
                <Area
                  dataKey="expend"
                  type="natural"
                  fill="url(#fillExpend)"
                  stroke="var(--color-expend)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
