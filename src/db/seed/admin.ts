import bcrypt from "bcryptjs";
import db from "..";
import { adminTable } from "../schema";
import { timeNowUTC } from "@/utils/utils";

db.insert(adminTable)
  .values({
    name: "admin",
    email: "admin@gmail.com",
    created_at: timeNowUTC(),
    password: bcrypt.hashSync("12345678"),
  })
  .execute()
  .then(() => console.log("sukses melakukan seed admin"))
  .catch((e) => console.log("gagal seed admin", e));
