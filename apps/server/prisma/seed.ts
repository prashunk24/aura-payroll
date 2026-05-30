import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const employerWallet = 'EmployerWalletAddress1111111111111111111111';

  const employees = [
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      walletAddress: 'HxJRUqz41VyxqWBAGPZ5Yyk4tEKnbNLYi2ry9rYthiQo',
      region: 'UK',
      salary: 5000,
    },
    {
      name: 'Alan Turing',
      email: 'alan@example.com',
      walletAddress: '3DsP3fnbsUBUEzFNWXauUr8nooDokcFHRUDAPqVJriET',
      region: 'UK',
      salary: 4500,
    },
    {
      name: 'Srinivasa Ramanujan',
      email: 'ramanujan@example.com',
      walletAddress: '8Zue4xGMFYbjUB2ktia665TMphYRPXEDMSHjPZx7oguL',
      region: 'IN',
      salary: 6200,
    },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
