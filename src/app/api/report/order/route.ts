import { NextRequest } from "next/server";
import { ReportOrderHandler } from "../../handler/report-handler";

export async function GET(req: NextRequest) {
  return ReportOrderHandler(req);
}
