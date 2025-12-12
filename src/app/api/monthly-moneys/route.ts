import { ResponseOk } from "@/utils/http";
import { NextRequest } from "next/server";
import {
  CreateMonthlyMoneyHandler,
  ListAllMonthlyMoneyHandler,
} from "../handler/monthly-money-handler";

export async function POST(req: NextRequest) {
  return CreateMonthlyMoneyHandler(req);
}

export async function GET() {
  return ListAllMonthlyMoneyHandler();
}
