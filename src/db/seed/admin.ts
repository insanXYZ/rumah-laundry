import bcrypt from "bcryptjs";
import db from "..";
import { adminTable } from "../schema";

db.insert(adminTable)
  .values({
    name: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345678"),
  })
  .execute()
  .then(() => console.log("sukses melakukan seed admin"))
  .catch((e) => console.log("gagal seed admin", e));
