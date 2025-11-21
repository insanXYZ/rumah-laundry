import { LoginRequestSchema } from "@/app/dto/auth-dto";
import db from "@/db";
import { adminsTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { CreateToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// POST /admin/login
export const LoginHandler = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = LoginRequestSchema.parse(body);

    const admins = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.email, parsed.email));

    if (admins.length == 0) {
      return ResponseErr("email atau password salah");
    }

    const admin = admins[0];

    const compared = bcrypt.compareSync(parsed.password, admin.password);
    if (!compared) {
      return ResponseErr("email atau password salah");
    }

    const accessToken = await CreateToken({
      exp: "15m",
      payload: {
        sub: admin.id.toString(),
      },
    });

    return ResponseOk(
      {
        access_token: accessToken,
      },
      "berhasil masuk"
    );
  } catch (err) {
    return ResponseErr("email atau password salah", err);
  }
};
