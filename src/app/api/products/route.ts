import { NextRequest } from "next/server";
import {
  AddProductHandler,
  ListProductsHandler,
} from "../handler/product-handler";

export async function POST(req: NextRequest) {
  return AddProductHandler(req);
}

export async function GET(req: NextRequest) {
  return ListProductsHandler(req);
}
