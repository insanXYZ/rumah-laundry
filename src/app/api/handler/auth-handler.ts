import { Admin, LoginRequestSchema } from "@/app/dto/auth-dto";
import db from "@/db";
import { adminsTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { CreateToken, DecodeJwt } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
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
      exp: "360d",
      payload: {
        sub: admin.id.toString(),
      },
    });

    const response = ResponseOk(
      {
        access_token: accessToken,
      },
      "berhasil masuk"
    );

    response.cookies.set("X-ACC-TOKEN", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 360,
    });

    return response;
  } catch (err) {
    return ResponseErr("email atau password salah", err);
  }
};

export async function MeHandler(req: NextRequest) {
  try {
    const token = req.cookies.get("X-ACC-TOKEN")?.value;

    if (!token) {
      return ResponseErr("gagal mendapatkan informasi user", null);
    }

    const claims = DecodeJwt(token);

    const admins = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, Number(claims.sub)));

    let valAdmin = admins[0];

    const admin: Admin = {
      id: valAdmin.id,
      email: valAdmin.email,
      name: valAdmin.name,
    };

    return ResponseOk(admin, "sukses mendapatkan informasi user");
  } catch (error) {
    return ResponseErr("gagal mendapatkan informasi user", error);
  }
}
