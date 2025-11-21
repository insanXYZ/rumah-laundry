import { AddSantriSchema, Santri } from "@/app/dto/santri-dto";
import db from "@/db";
import { santrisTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { NextRequest } from "next/server";

// GET /santri
export async function ListAllSantriHandler() {
  try {
    const santris = await db.select().from(santrisTable);

    let listSantri: Santri[] = [];

    santris.forEach((v) => {
      const data: Santri = {
        class: v.class,
        id: v.id,
        name: v.name,
        number_phone: v.number_phone,
      };

      listSantri.push(data);
    });

    return ResponseOk(listSantri, "sukses mendapat data santri");
  } catch (error) {
    return ResponseErr("gagal mendapat data santri", error);
  }
}

export async function CreateSantriHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddSantriSchema.parse(json);

    await db
      .insert(santrisTable)
      .values({
        name: body.name,
        class: body.class,
        number_phone: body.number_phone,
      })
      .execute();

    return ResponseOk(null, "sukses menambah santri");
  } catch (error) {
    return ResponseErr("gagal menambah santri", error);
  }
}
