import { PrismaClient, UserRole, TableStatus, CourseType, TaxCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Created admin: ${admin.email}`);

  // 2. Create sample tables
  const tables = [
    { tableNumber: 1, capacity: 4 },
    { tableNumber: 2, capacity: 4 },
    { tableNumber: 3, capacity: 2 },
    { tableNumber: 4, capacity: 6 },
    { tableNumber: 5, capacity: 4 },
    { tableNumber: 6, capacity: 2 },
    { tableNumber: 7, capacity: 8 },
    { tableNumber: 8, capacity: 4 },
  ];

  for (const table of tables) {
    await prisma.table.upsert({
      where: { tableNumber: table.tableNumber },
      update: {},
      create: {
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        status: TableStatus.FREE,
      },
    });
  }
  console.log(`✅ Created ${tables.length} tables`);

  // 3. Create menu categories
  const categories = [
    { name: 'Appetizers', displayOrder: 1 },
    { name: 'Mains', displayOrder: 2 },
    { name: 'Desserts', displayOrder: 3 },
    { name: 'Beverages', displayOrder: 4 },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const result = await prisma.menuCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        displayOrder: cat.displayOrder,
      },
    });
    createdCategories.push(result);
  }
  console.log(`✅ Created ${createdCategories.length} categories`);

  // Helper to get category ID by name
  const getCategoryId = (name: string) => {
    const cat = createdCategories.find((c) => c.name === name);
    if (!cat) throw new Error(`Category ${name} not found`);
    return cat.id;
  };

  // 4. Create menu items
  const menuItems = [
    // Appetizers
    {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs',
      price: 5.99,
      categoryName: 'Appetizers',
      course: CourseType.STARTER,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 100,
    },
    {
      name: 'Chicken Wings',
      description: 'Crispy wings with spicy sauce',
      price: 9.99,
      categoryName: 'Appetizers',
      course: CourseType.STARTER,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 80,
    },
    {
      name: 'Spring Rolls',
      description: 'Crispy rolls with vegetables and glass noodles',
      price: 7.99,
      categoryName: 'Appetizers',
      course: CourseType.STARTER,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 60,
    },

    // Mains
    {
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, and cheese',
      price: 12.99,
      categoryName: 'Mains',
      course: CourseType.MAIN,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 50,
    },
    {
      name: 'Chicken Pasta',
      description: 'Creamy pasta with grilled chicken and herbs',
      price: 14.99,
      categoryName: 'Mains',
      course: CourseType.MAIN,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 40,
    },
    {
      name: 'Grilled Salmon',
      description: 'Salmon fillet with lemon butter sauce',
      price: 18.99,
      categoryName: 'Mains',
      course: CourseType.MAIN,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 30,
    },
    {
      name: 'Steak & Fries',
      description: 'Grilled sirloin steak with crispy fries',
      price: 22.99,
      categoryName: 'Mains',
      course: CourseType.MAIN,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 25,
    },
    {
      name: 'Vegetable Curry',
      description: 'Mixed vegetables in a spicy curry sauce',
      price: 13.99,
      categoryName: 'Mains',
      course: CourseType.MAIN,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 35,
    },

    // Desserts
    {
      name: 'Chocolate Brownie',
      description: 'Warm brownie with vanilla ice cream',
      price: 6.99,
      categoryName: 'Desserts',
      course: CourseType.DESSERT,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 40,
    },
    {
      name: 'Cheesecake',
      description: 'Classic New York cheesecake with berry sauce',
      price: 7.99,
      categoryName: 'Desserts',
      course: CourseType.DESSERT,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 30,
    },
    {
      name: 'Ice Cream Sundae',
      description: 'Three scoops with chocolate sauce and nuts',
      price: 5.99,
      categoryName: 'Desserts',
      course: CourseType.DESSERT,
      taxCategory: TaxCategory.FOOD,
      stockQuantity: 50,
    },

    // Beverages (Alcoholic)
    {
      name: 'House Wine',
      description: 'Red or white house wine (glass)',
      price: 8.99,
      categoryName: 'Beverages',
      course: CourseType.BEVERAGE,
      taxCategory: TaxCategory.ALCOHOL,
      stockQuantity: 60,
    },
    {
      name: 'Craft Beer',
      description: 'Local craft beer (bottle)',
      price: 6.99,
      categoryName: 'Beverages',
      course: CourseType.BEVERAGE,
      taxCategory: TaxCategory.ALCOHOL,
      stockQuantity: 80,
    },

    // Beverages (Non-alcoholic)
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 4.99,
      categoryName: 'Beverages',
      course: CourseType.BEVERAGE,
      taxCategory: TaxCategory.BEVERAGE,
      stockQuantity: 100,
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      price: 3.99,
      categoryName: 'Beverages',
      course: CourseType.BEVERAGE,
      taxCategory: TaxCategory.BEVERAGE,
      stockQuantity: 120,
    },
    {
      name: 'Coffee',
      description: 'Freshly brewed coffee',
      price: 2.99,
      categoryName: 'Beverages',
      course: CourseType.BEVERAGE,
      taxCategory: TaxCategory.BEVERAGE,
      stockQuantity: 150,
    },
  ];

  for (const item of menuItems) {
    const categoryId = getCategoryId(item.categoryName);
    // Check if item already exists (by name and category)
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name, categoryId: categoryId },
    });
    if (!existing) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: categoryId,
          course: item.course,
          taxCategory: item.taxCategory,
          stockQuantity: item.stockQuantity,
        },
      });
    }
  }
  console.log(`✅ Created ${menuItems.length} menu items`);

  // 5. Get the Classic Burger to add modifiers
  const burger = await prisma.menuItem.findFirst({
    where: { name: 'Classic Burger' },
  });

  if (burger) {
    // Add modifier group: Patty Options
    const pattyGroup = await prisma.modifierGroup.upsert({
      where: { id: 'patty-group' },
      update: {},
      create: {
        id: 'patty-group',
        name: 'Patty Options',
        minSelect: 1,
        maxSelect: 1,
        menuItemId: burger.id,
      },
    });

    await prisma.modifierOption.upsert({
      where: { id: 'patty-beef' },
      update: {},
      create: {
        id: 'patty-beef',
        name: 'Beef',
        priceAdjustment: 0,
        groupId: pattyGroup.id,
      },
    });
    await prisma.modifierOption.upsert({
      where: { id: 'patty-chicken' },
      update: {},
      create: {
        id: 'patty-chicken',
        name: 'Chicken',
        priceAdjustment: 1.0,
        groupId: pattyGroup.id,
      },
    });
    await prisma.modifierOption.upsert({
      where: { id: 'patty-veggie' },
      update: {},
      create: {
        id: 'patty-veggie',
        name: 'Veggie',
        priceAdjustment: 0.5,
        groupId: pattyGroup.id,
      },
    });

    // Add modifier group: Cheese
    const cheeseGroup = await prisma.modifierGroup.upsert({
      where: { id: 'cheese-group' },
      update: {},
      create: {
        id: 'cheese-group',
        name: 'Cheese Options',
        minSelect: 0,
        maxSelect: 2,
        menuItemId: burger.id,
      },
    });

    await prisma.modifierOption.upsert({
      where: { id: 'cheese-cheddar' },
      update: {},
      create: {
        id: 'cheese-cheddar',
        name: 'Cheddar',
        priceAdjustment: 1.5,
        groupId: cheeseGroup.id,
      },
    });
    await prisma.modifierOption.upsert({
      where: { id: 'cheese-swiss' },
      update: {},
      create: {
        id: 'cheese-swiss',
        name: 'Swiss',
        priceAdjustment: 1.5,
        groupId: cheeseGroup.id,
      },
    });
    await prisma.modifierOption.upsert({
      where: { id: 'cheese-pepperjack' },
      update: {},
      create: {
        id: 'cheese-pepperjack',
        name: 'Pepper Jack',
        priceAdjustment: 1.5,
        groupId: cheeseGroup.id,
      },
    });

    console.log('✅ Created modifier groups for Classic Burger');
  }

  // 6. Add global tax setting
  await prisma.setting.upsert({
    where: { key: 'GLOBAL_TAX_RATE' },
    update: { value: '10.0' },
    create: {
      key: 'GLOBAL_TAX_RATE',
      value: '10.0',
      description: 'Global sales tax rate (percentage)',
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });