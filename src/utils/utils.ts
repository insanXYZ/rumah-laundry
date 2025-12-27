import { PayloadJWT } from "@/types/types";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export const ConvertRupiah = (amount: number) => {
  // return new Intl.NumberFormat("id-ID", {
  //   style: "currency",
  //   currency: "IDR",
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // }).format(number);

  if (isNaN(amount) || amount == undefined) {
    return `Rp 0`;
  }

  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
};

export function formatToLocalTimezone(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!date || isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getPayloadJwt = (req: NextRequest): PayloadJWT => {
  const payload = req.headers.get("x-user-payload");

  return JSON.parse(payload!) as PayloadJWT;
};

export const dateToTimezone = (date: Date, timezone: string): Date => {
  return DateTime.fromJSDate(date).setZone(timezone).toJSDate();
};

export const dateToUtc = (date: Date) : Date =>   {
  return DateTime.fromJSDate(date).toUTC().toJSDate();
};

export const timeNowUTC = () : Date =>  {
  return DateTime.now().toUTC().toJSDate();
};