import { NextRequest } from "next/server";
import { ReportExpendHandler } from "../../handler/report-handler";

export async function GET(req: NextRequest) {
  return ReportExpendHandler(req);
}
