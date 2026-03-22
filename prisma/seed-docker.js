const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.user.findFirst();
  if (exists) {
    console.log("==> Admin user already exists, skipping seed");
    return;
  }
  const hash = await bcryptjs.hash("admin", 12);
  await prisma.user.create({
    data: {
      email: "admin",
      password: hash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("==> Admin user created: admin / admin");
}

main()
  .catch((e) => console.error("Seed error:", e))
  .finally(() => prisma.$disconnect());
