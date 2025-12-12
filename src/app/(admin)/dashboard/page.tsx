"use client";

import { GetInformationDashoard } from "@/app/dto/dashboard-dto";
import { CardDashboard } from "@/components/dashboard/card-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQueryData } from "@/utils/tanstack";

import { ConvertRupiah } from "@/utils/utils";
import { useEffect, useState } from "react";
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
  const [dashboard, setDashboard] = useState<GetInformationDashoard>();
  const { data, isSuccess } = useQueryData(["getDashboard"], "/dashboard");

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDashboard(data.data);
    }
  }, [isSuccess]);

  const [timeRange, setTimeRange] = useState("30d");

  const filteredData = dashboard?.chart_income_expends.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="flex flex-col gap-5">
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
