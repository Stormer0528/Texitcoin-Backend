import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'james',
    fullname: 'James Reynolds',
    sponsorName: 'BlackRifle',
    introducerFullName: 'Rob Reynolds',
    mobile: '+1 5052121515',
    assetId: 'oVPDrB',
    commissionPayout: '$USDT Wallet Address',
    txcPayout: '$TXC-Cold',
    txcCold: 'ToVPDrBvSUFrdZasJrz9EXmdENBrt2g3bb',
    email: 'vitovodenko@gmail.com',
    password: hashSync('123456789', 12),
    isAdmin: true,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
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
