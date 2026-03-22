import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcryptjs.hash("admin", 12);
  await prisma.user.upsert({
    where: { email: "admin" },
    update: {},
    create: {
      email: "admin",
      password: hash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Seed completado. Usuario: admin / admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
