const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // ===== MANAGER (fixed account) =====
  const managerPassword = "Admin123!";
  const managerHash = await bcrypt.hash(managerPassword, 12);

  await prisma.user.upsert({
    where: { staffId: "ADMIN001" },
    update: {
      role: "MANAGER",
      name: "System Manager",
      passwordHash: managerHash,
    },
    create: {
      staffId: "ADMIN001",
      role: "MANAGER",
      name: "System Manager",
      passwordHash: managerHash,
    },
  });

  // ===== EXISTING STAFF (kept as STAFF) =====
  const staffPassword = "Manager123!";
  const staffHash = await bcrypt.hash(staffPassword, 12);

  await prisma.user.upsert({
    where: { staffId: "MGR001" },
    update: {
      role: "STAFF",
      name: "Staff User",
      passwordHash: staffHash,
    },
    create: {
      staffId: "MGR001",
      role: "STAFF",
      name: "Staff User",
      passwordHash: staffHash,
    },
  });

  console.log("=================================");
  console.log("MANAGER ACCOUNT");
  console.log("Staff ID: ADMIN001");
  console.log("Password:", managerPassword);
  console.log("---------------------------------");
  console.log("STAFF ACCOUNT");
  console.log("Staff ID: MGR001");
  console.log("Password:", staffPassword);
  console.log("=================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
