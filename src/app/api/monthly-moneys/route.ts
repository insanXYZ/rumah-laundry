import { NextRequest } from "next/server";
import {
  AddSantriMonthlyMoneyHandler,
  ListMonthlyMoneysHandler,
} from "../handler/monthly-money-handler";

export async function POST(req: NextRequest) {
  return AddSantriMonthlyMoneyHandler(req);
}

export async function GET() {
  return ListMonthlyMoneysHandler();
}
