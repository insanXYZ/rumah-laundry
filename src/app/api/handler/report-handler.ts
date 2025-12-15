import db from "@/db";
import {
  customersTable,
  orderItemTable,
  orderTable,
  productsTable,
} from "@/db/schema";
import { ResponseErr } from "@/utils/http";
import { ConvertRupiah, GetPayload } from "@/utils/utils";
import { between, desc, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function ReportOrderHandler(req: NextRequest) {
  try {
    const payload = GetPayload(req);
    const now = DateTime.now().setZone(payload.tz);
    const startDate = now.startOf("month").toJSDate();
    const endDate = now.endOf("month").toJSDate();

    const orders = await db
      .select()
      .from(orderTable)
      .innerJoin(customersTable, eq(customersTable.id, orderTable.customer_id))
      .innerJoin(orderItemTable, eq(orderItemTable.order_id, orderTable.id))
      .innerJoin(productsTable, eq(orderItemTable.product_id, productsTable.id))
      .where(between(orderTable.created_at, startDate, endDate))
      .orderBy(desc(orderTable.created_at));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Transaksi Bulanan");

    worksheet.columns = [
      { header: "ID Transaksi", key: "order_id", width: 12 },
      { header: "Nama Pelanggan", key: "customer_name", width: 25 },
      { header: "Jenis Pelanggan", key: "customer_type", width: 25 },
      { header: "Tanggal Order", key: "order_date", width: 20 },
      { header: "Status Order", key: "status", width: 15 },
      { header: "Nama Layanan", key: "product_name", width: 25 },
      { header: "Jumlah", key: "quantity", width: 10 },
      { header: "Harga Satuan", key: "price", width: 15 },
      { header: "Total Item", key: "total_price", width: 15 },
    ];

    // styling header
    worksheet.getRow(1).font = { bold: true };

    for (const row of orders) {
      worksheet.addRow({
        order_id: row.orders.id,
        customer_name: row.customers.name,
        customer_type: row.customers.type,
        order_date: DateTime.fromJSDate(row.orders.created_at!)
          .setZone(payload.tz)
          .toFormat("yyyy-MM-dd hh:mm"),
        status: row.orders.status,
        product_name: row.products.name,
        quantity: `${row.order_items.quantity} ${row.products.unit}`,
        price: row.order_items.price!,
        total_price: row.order_items.total_price!,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `laporan-transaksi-${now.toFormat("yyyy-MM")}.xlsx`;

    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set("Content-Disposition", `attachment; filename=${fileName}`);

    return new NextResponse(buffer, { headers });
  } catch (error) {
    return ResponseErr("gagal membuat laporan transaksi bulanan", error);
  }
}
