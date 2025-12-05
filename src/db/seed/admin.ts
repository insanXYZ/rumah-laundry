import bcrypt from "bcryptjs";
import db from "..";
import { adminsTable } from "../schema";

db.insert(adminsTable)
  .values({
    name: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345678"),
  })
  .execute()
  .then(() => console.log("sukses melakukan seed admin"))
  .catch((e) => console.log("gagal seed admin", e));
