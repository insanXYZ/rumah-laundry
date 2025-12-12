import { NextRequest } from "next/server";
import { GetDashboardItemHandler } from "../handler/dashboard-handler";

export async function GET(req: NextRequest) {
  return GetDashboardItemHandler(req);
}
