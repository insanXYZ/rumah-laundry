import {
  ChartIncomeExpend,
  GetInformationDashoard,
} from "@/app/dto/dashboard-dto";
import { acceptedStatusOrder } from "@/app/dto/order-dto";
import db from "@/db";
import { inventoryStockTable, orderItemTable, orderTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { toUTC } from "@/utils/utils";
import { and, between, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

// export async function GetDashboardItemHandler(req: NextRequest) {
//   try {
//     const res: GetInformationDashoard = {
//       chart_income_expends: [],
//       expend: 0,
//       income: 0,
//       total_finished_order: 0,
//       total_order: 0,
//     };

//     const today = new Date();

//     const firstDay = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       1,
//       0,
//       0,
//       0,
//       0
//     );

//     const lastDay = new Date(
//       today.getFullYear(),
//       today.getMonth() + 1,
//       0,
//       23,
//       59,
//       59,
//       999
//     );

//     const daysInMonth = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       0
//     ).getDate();

//     const allDates: string[] = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       allDates.push(`${today.getFullYear()}-${today.getMonth() + 1}-${day}`);
//     }

//     const incomes = await db
//       .select({
//         income: sql<number>`sum(${orderItemTable.total_price})`,
//       })
//       .from(orderTable)
//       .where(
//         and(
//           eq(orderTable.status, acceptedStatusOrder[1]),
//           between(orderTable.created_at, firstDay, lastDay)
//         )
//       )
//       .innerJoin(orderItemTable, eq(orderTable.id, orderItemTable.order_id));

//     if (incomes) {
//       res.income = Number(incomes[0].income);
//     }

//     const total_orders = await db
//       .select({
//         total_order: sql<number>`count(${orderTable.id})`,
//       })
//       .from(orderTable)
//       .where(between(orderTable.created_at, firstDay, lastDay));

//     if (total_orders) {
//       res.total_order = Number(total_orders[0].total_order);
//     }

//     const expends = await db
//       .select({
//         expend: sql<number>`sum(${inventoryStockTable.price})`,
//       })
//       .from(inventoryStockTable)
//       .where(between(inventoryStockTable.created_at, firstDay, lastDay));

//     if (expends) {
//       res.expend = Number(expends[0].expend);
//     }

//     const total_order_finisheds = await db
//       .select({
//         total_order: sql<number>`count(${orderTable.id})`,
//       })
//       .from(orderTable)
//       .where(
//         and(
//           between(orderTable.created_at, firstDay, lastDay),
//           eq(orderTable.status, acceptedStatusOrder[1])
//         )
//       );

//     if (total_order_finisheds) {
//       res.total_finished_order = Number(total_order_finisheds[0].total_order);
//     }

//     const pendapatan = await db
//       .select({
//         tanggal: sql<string>`DATE(${orderItemTable.created_at})`.as("tanggal"),
//         total: sql<number>`COALESCE(SUM(${orderItemTable.total_price}), 0)`.as(
//           "total"
//         ),
//       })
//       .from(orderItemTable)
//       .where(between(orderItemTable.created_at, firstDay, lastDay))
//       .groupBy(sql`DATE(${orderItemTable.created_at})`);

//     const pengeluaran = await db
//       .select({
//         tanggal: sql<string>`DATE(${inventoryStockTable.created_at})`.as(
//           "tanggal"
//         ),
//         total:
//           sql<number>`COALESCE(SUM(${inventoryStockTable.price} * ${inventoryStockTable.stock}), 0)`.as(
//             "total"
//           ),
//       })
//       .from(inventoryStockTable)
//       .where(between(inventoryStockTable.created_at, firstDay, lastDay))
//       .groupBy(sql`DATE(${inventoryStockTable.created_at})`);

//     const pendapatanMap = new Map(pendapatan.map((p) => [p.tanggal, p.total]));
//     const pengeluaranMap = new Map(
//       pengeluaran.map((p) => [p.tanggal, p.total])
//     );

//     const result: ChartIncomeExpend[] = allDates.map((date) => ({
//       date: date,
//       income: Number(pendapatanMap.get(date)) || 0,
//       expend: Number(pengeluaranMap.get(date)) || 0,
//     }));

//     res.chart_income_expends = result;

//     return ResponseOk(res, "sukses mendapatkan informasi dashboard");
//   } catch (error) {
//     return ResponseErr("gagal mendapatkan data dashboard", error);
//   }
// }

export async function GetDashboardItemHandler(req: NextRequest) {
  try {
    const res: GetInformationDashoard = {
      chart_income_expends: [],
      expend: 0,
      income: 0,
      total_finished_order: 0,
      total_order: 0,
    };

    const today = new Date();

    // Convert ke UTC
    const firstDayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const lastDayLocal = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const firstDay = toUTC(firstDayLocal);
    const lastDay = toUTC(lastDayLocal);

    // Fix: Bulan harus +1 untuk mendapatkan jumlah hari yang benar
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const allDates: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = day.toString().padStart(2, "0");
      allDates.push(`${today.getFullYear()}-${month}-${dayStr}`);
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
          between(orderTable.created_at, firstDay, lastDay)
        )
      );

    res.income = Number(incomes[0]?.income) || 0;

    // Query total orders
    const total_orders = await db
      .select({
        total_order: sql<number>`COUNT(${orderTable.id})`,
      })
      .from(orderTable)
      .where(between(orderTable.created_at, firstDay, lastDay));

    res.total_order = Number(total_orders[0]?.total_order) || 0;

    const expends = await db
      .select({
        expend: sql<number>`COALESCE(SUM(${inventoryStockTable.price}), 0)`,
      })
      .from(inventoryStockTable)
      .where(between(inventoryStockTable.created_at, firstDay, lastDay));

    res.expend = Number(expends[0]?.expend) || 0;

    // Query total finished orders
    const total_order_finisheds = await db
      .select({
        total_order: sql<number>`COUNT(${orderTable.id})`,
      })
      .from(orderTable)
      .where(
        and(
          between(orderTable.created_at, firstDay, lastDay),
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
      .where(between(orderItemTable.created_at, firstDay, lastDay))
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
      .where(between(inventoryStockTable.created_at, firstDay, lastDay))
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
