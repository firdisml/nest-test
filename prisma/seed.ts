import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: '10 Credit',
      product_api: 'price_1LzPxhC3J13TnkehVXwawAAK',
      price: new Prisma.Decimal(10.0),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
