const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "Manager123!"; // THIS is what you type to log in
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  await prisma.user.create({
    data: {
      staffId: "MGR001",
      role: "STAFF",
      name: "Manager",
      passwordHash,
    },
  });

  console.log("=================================");
  console.log("STAFF USER CREATED");
  console.log("Staff ID: MGR001");
  console.log("Password:", plainPassword);
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
