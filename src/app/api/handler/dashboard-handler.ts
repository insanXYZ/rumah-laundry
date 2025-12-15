import {
  ChartIncomeExpend,
  GetInformationDashoard,
} from "@/app/dto/dashboard-dto";
import { acceptedStatusOrder } from "@/app/dto/order-dto";
import db from "@/db";
import { inventoryStockTable, orderItemTable, orderTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { GetPayload, toUTC } from "@/utils/utils";
import { endOfDay } from "date-fns";
import { and, between, eq, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export async function GetDashboardItemHandler(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const payload = GetPayload(req);
    const now = DateTime.now();
    const startParam = params.get("start");
    const lastParam = params.get("last");

    const startDate = (
      startParam
        ? DateTime.fromISO(startParam, { zone: payload.tz })
        : now.startOf("month")
    ).startOf("day");

    const lastDate = (
      lastParam
        ? DateTime.fromISO(lastParam, { zone: payload.tz })
        : now.endOf("month")
    ).endOf("day");

    const res: GetInformationDashoard = {
      chart_income_expends: [],
      expend: 0,
      income: 0,
      total_finished_order: 0,
      total_order: 0,
    };

    const dates: string[] = [];

    let cursor = startDate.startOf("day");
    while (cursor <= lastDate) {
      dates.push(cursor.toFormat("yyyy-MM-dd"));
      cursor = cursor.plus({ days: 1 });
    }

    const [total_finished_order] = await db
      .select({
        total_finished_order: sql<number>`COALESCE(COUNT(${orderTable.id}),0)`,
      })
      .from(orderTable)
      .where(
        and(
          eq(orderTable.status, acceptedStatusOrder[1]),
          between(
            orderTable.created_at,
            startDate.toJSDate(),
            lastDate.toJSDate()
          )
        )
      );

    res.total_finished_order = total_finished_order.total_finished_order;

    const [total_order] = await db
      .select({
        total_order: sql<number>`COALESCE(COUNT(${orderTable.id}),0)`,
      })
      .from(orderTable)
      .where(
        between(
          orderTable.created_at,
          startDate.toJSDate(),
          lastDate.toJSDate()
        )
      );

    res.total_order = total_order.total_order;

    const itemOrders = await db
      .select()
      .from(orderItemTable)
      .where(
        between(
          orderItemTable.created_at,
          startDate.toJSDate(),
          lastDate.toJSDate()
        )
      );

    const income = itemOrders.reduce((sum, item) => {
      return sum + Number(item.total_price ?? 0);
    }, 0);

    const incomeMap = itemOrders.reduce<Record<string, number>>((acc, item) => {
      const date = DateTime.fromJSDate(item.created_at!)
        .setZone(payload.tz)
        .toFormat("yyyy-MM-dd");

      acc[date] = (acc[date] ?? 0) + Number(item.total_price ?? 0);
      return acc;
    }, {});

    res.income = income;

    const inventoriStocks = await db
      .select()
      .from(inventoryStockTable)
      .where(
        between(
          inventoryStockTable.created_at,
          startDate.toJSDate(),
          lastDate.toJSDate()
        )
      );

    const expend = inventoriStocks.reduce((sum, item) => {
      return sum + Number(item.price ?? 0);
    }, 0);

    const expendMap = inventoriStocks.reduce<Record<string, number>>(
      (acc, item) => {
        const date = DateTime.fromJSDate(item.created_at!)
          .setZone(payload.tz)
          .toFormat("yyyy-MM-dd");

        acc[date] = (acc[date] ?? 0) + Number(item.price ?? 0);
        return acc;
      },
      {}
    );

    res.expend = expend;

    res.chart_income_expends = dates.map((date) => ({
      date,
      income: incomeMap[date] ?? 0,
      expend: expendMap[date] ?? 0,
    }));

    return ResponseOk(res, "sukses mendapatkan informasi dashboard");
  } catch (error) {
    console.error("Error in GetDashboardItemHandler:", error);
    return ResponseErr("gagal mendapatkan data dashboard", error);
  }
}
