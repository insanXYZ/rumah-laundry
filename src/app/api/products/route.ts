import { NextRequest } from "next/server";
import {
  CreateProductHandler,
  ListAllProductsHandler,
} from "../handler/product-handler";

export async function POST(req: NextRequest) {
  return CreateProductHandler(req);
}

export async function GET(req: NextRequest) {
  return ListAllProductsHandler(req);
}
