import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcryptjs.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@mxshots.com" },
    update: {},
    create: {
      email: "admin@mxshots.com",
      password: hash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Seed completado. Admin: admin@mxshots.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
