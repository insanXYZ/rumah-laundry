import { PayloadJWT } from "@/types/jwt";
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

export const toUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};

export const GetPayload = (req: NextRequest): PayloadJWT => {
  const payload = req.headers.get("x-user-payload");

  return JSON.parse(payload!) as PayloadJWT;
};
