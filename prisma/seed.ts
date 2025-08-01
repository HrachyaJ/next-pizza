import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log("🌱 Starting seed...");

  // Read the exported data
  const dataPath = path.join(process.cwd(), "database-export.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(rawData);

  console.log("📊 Data loaded from export file");

  try {
    // Clear existing data in correct order (respecting foreign key constraints)
    console.log("🧹 Clearing existing data...");

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.storyItem.deleteMany();
    await prisma.story.deleteMany();
    await prisma.verificationCode.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.ingredient.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Existing data cleared");

    // Seed data in correct order (respecting foreign key constraints)

    // 1. Users (if any)
    if (data.users && data.users.length > 0) {
      console.log(`👥 Seeding ${data.users.length} users...`);
      for (const user of data.users) {
        await prisma.user.create({ data: user });
      }
    }

    // 2. Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`📂 Seeding ${data.categories.length} categories...`);
      for (const category of data.categories) {
        await prisma.category.create({ data: category });
      }
    }

    // 3. Ingredients
    if (data.ingredients && data.ingredients.length > 0) {
      console.log(`🥬 Seeding ${data.ingredients.length} ingredients...`);
      for (const ingredient of data.ingredients) {
        await prisma.ingredient.create({ data: ingredient });
      }
    }

    // 4. Products
    if (data.products && data.products.length > 0) {
      console.log(`🍕 Seeding ${data.products.length} products...`);
      for (const product of data.products) {
        await prisma.product.create({ data: product });
      }
    }

    // 5. Product Items
    if (data.productItems && data.productItems.length > 0) {
      console.log(`📦 Seeding ${data.productItems.length} product items...`);
      for (const item of data.productItems) {
        await prisma.productItem.create({ data: item });
      }
    }

    // 6. Link Pizzas with Random Ingredients
    console.log("🍕🥬 Linking pizzas with random ingredients...");

    // Get all products and ingredients from database
    const allProducts = await prisma.product.findMany({
      include: { items: true },
    });
    const allIngredients = await prisma.ingredient.findMany();

    if (allIngredients.length > 0) {
      let pizzaCount = 0;

      for (const product of allProducts) {
        // Check if this product is a pizza (has items with pizzaType)
        const isPizza = product.items.some((item) => item.pizzaType !== null);

        if (isPizza) {
          // Randomly select 3-8 ingredients for each pizza
          const randomIngredients = getRandomItems(allIngredients, 3, 8);

          await prisma.product.update({
            where: { id: product.id },
            data: {
              ingredients: {
                connect: randomIngredients.map((ingredient) => ({
                  id: ingredient.id,
                })),
              },
            },
          });

          pizzaCount++;
          console.log(
            `  ✅ Linked ${randomIngredients.length} ingredients to "${product.name}"`
          );
        }
      }

      console.log(
        `🎉 Successfully linked ingredients to ${pizzaCount} pizzas!`
      );
    } else {
      console.log("⚠️ No ingredients found to link with pizzas");
    }

    // 7. Stories
    if (data.stories && data.stories.length > 0) {
      console.log(`📖 Seeding ${data.stories.length} stories...`);
      for (const story of data.stories) {
        await prisma.story.create({ data: story });
      }
    }

    // 8. Story Items
    if (data.storyItems && data.storyItems.length > 0) {
      console.log(`📄 Seeding ${data.storyItems.length} story items...`);
      for (const item of data.storyItems) {
        await prisma.storyItem.create({ data: item });
      }
    }

    // 9. Carts
    if (data.carts && data.carts.length > 0) {
      console.log(`🛒 Seeding ${data.carts.length} carts...`);
      for (const cart of data.carts) {
        await prisma.cart.create({ data: cart });
      }
    }

    // 10. Cart Items
    if (data.cartItems && data.cartItems.length > 0) {
      console.log(`🛍️ Seeding ${data.cartItems.length} cart items...`);
      for (const item of data.cartItems) {
        await prisma.cartItem.create({ data: item });
      }
    }

    // 11. Orders
    if (data.orders && data.orders.length > 0) {
      console.log(`📋 Seeding ${data.orders.length} orders...`);
      for (const order of data.orders) {
        await prisma.order.create({ data: order });
      }
    }

    // 12. Verification Codes
    if (data.verificationCodes && data.verificationCodes.length > 0) {
      console.log(
        `🔐 Seeding ${data.verificationCodes.length} verification codes...`
      );
      for (const code of data.verificationCodes) {
        await prisma.verificationCode.create({ data: code });
      }
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
