import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Testa att hämta alla användare från databasen
    const users = await prisma.user.findMany();
    console.log("Users:", users);

    // Exempel på att lägga till en användare
    const newUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "securepassword123", // Add a password field
      },
    });
    console.log("Created User:", newUser);

    //Exempel på att uppdatera en användare
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { name: "Updated Test User" },
    });
    console.log("Updated User:", updatedUser);

    //Exempel på att ta bort en användare
    const deletedUser = await prisma.user.delete({
      where: { id: updatedUser.id },
    });
    console.log("Deleted User:", deletedUser);
  } catch (e) {
    console.error("Error interacting with the database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
