import { NextRequest } from "next/server";
import {
  CreateSantriHandler,
  ListAllSantriHandler,
} from "../handler/santri-handler";

export async function GET() {
  return ListAllSantriHandler();
}

export async function POST(req: NextRequest) {
  return CreateSantriHandler(req);
}
