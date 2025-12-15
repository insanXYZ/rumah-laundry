import {
  ChartIncomeExpend,
  GetInformationDashoard,
} from "@/app/dto/dashboard-dto";
import { acceptedStatusOrder } from "@/app/dto/order-dto";
import db from "@/db";
import { inventoryStockTable, orderItemTable, orderTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { GetPayload, toUTC } from "@/utils/utils";
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
    )
      .startOf("day")
      .toJSDate();

    const lastDate = (
      lastParam
        ? DateTime.fromISO(lastParam, { zone: payload.tz })
        : now.endOf("month")
    )
      .endOf("day")
      .toJSDate();

    const res: GetInformationDashoard = {
      chart_income_expends: [],
      expend: 0,
      income: 0,
      total_finished_order: 0,
      total_order: 0,
    };

    const allDates: string[] = [];

    for (let day = 1; day <= now.daysInMonth; day++) {
      const date = now.set({ day });
      allDates.push(date.toFormat("yyyy-MM-dd"));
    }

    const incomes = await db
      .select({
        income: sql<number>`COALESCE(SUM(${orderItemTable.total_price}), 0)`,
      })
      .from(orderTable)
      .innerJoin(orderItemTable, eq(orderTable.id, orderItemTable.order_id))
      .where(
        and(
          eq(orderTable.status, acceptedStatusOrder[1]),
          between(orderTable.created_at, startDate, lastDate)
        )
      );

    res.income = Number(incomes[0]?.income) || 0;

    // Query total orders
    const total_orders = await db
      .select({
        total_order: sql<number>`COUNT(${orderTable.id})`,
      })
      .from(orderTable)
      .where(between(orderTable.created_at, startDate, lastDate));

    res.total_order = Number(total_orders[0]?.total_order) || 0;

    const expends = await db
      .select({
        expend: sql<number>`COALESCE(SUM(${inventoryStockTable.price}), 0)`,
      })
      .from(inventoryStockTable)
      .where(between(inventoryStockTable.created_at, startDate, lastDate));

    res.expend = Number(expends[0]?.expend) || 0;

    // Query total finished orders
    const total_order_finisheds = await db
      .select({
        total_order: sql<number>`COUNT(${orderTable.id})`,
      })
      .from(orderTable)
      .where(
        and(
          between(orderTable.created_at, startDate, lastDate),
          eq(orderTable.status, acceptedStatusOrder[1])
        )
      );

    res.total_finished_order =
      Number(total_order_finisheds[0]?.total_order) || 0;

    // Query pendapatan per tanggal
    const pendapatan = await db
      .select({
        tanggal: sql<string>`DATE(${orderItemTable.created_at})`.as("tanggal"),
        total: sql<number>`COALESCE(SUM(${orderItemTable.total_price}), 0)`.as(
          "total"
        ),
      })
      .from(orderItemTable)
      .where(between(orderItemTable.created_at, startDate, lastDate))
      .groupBy(sql`DATE(${orderItemTable.created_at})`);

    // Query pengeluaran per tanggal
    const pengeluaran = await db
      .select({
        tanggal: sql<string>`DATE(${inventoryStockTable.created_at})`.as(
          "tanggal"
        ),
        total: sql<number>`COALESCE(SUM(${inventoryStockTable.price}), 0)`.as(
          "total"
        ),
      })
      .from(inventoryStockTable)
      .where(between(inventoryStockTable.created_at, startDate, lastDate))
      .groupBy(sql`DATE(${inventoryStockTable.created_at})`);

    const pendapatanMap = new Map(
      pendapatan.map((p) => [p.tanggal, Number(p.total)])
    );
    const pengeluaranMap = new Map(
      pengeluaran.map((p) => [p.tanggal, Number(p.total)])
    );

    const result: ChartIncomeExpend[] = allDates.map((date) => ({
      date: date,
      income: Number(pendapatanMap.get(date)) || 0,
      expend: Number(pengeluaranMap.get(date)) || 0,
    }));

    res.chart_income_expends = result;

    return ResponseOk(res, "sukses mendapatkan informasi dashboard");
  } catch (error) {
    console.error("Error in GetDashboardItemHandler:", error);
    return ResponseErr("gagal mendapatkan data dashboard", error);
  }
}
