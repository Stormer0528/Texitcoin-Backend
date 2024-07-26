import { PrismaClient } from '@prisma/client';

import { getMembers } from '@/utils/connectMlm';
import Bluebird from 'bluebird';
import { PAYOUTS } from '@/consts';
import { hashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

const syncMembers = async () => {
  try {
    console.log('Syncing members...');

    const mlmMembers = await getMembers();
    const hashedPassword = await hashPassword('123456789');

    const members = await Bluebird.map(
      mlmMembers,
      async (member) => {
        const result = await prisma.member.upsert({
          where: { userId: member.userId },
          create: {
            ...member,
            password: hashedPassword,
          },
          update: member,
        });

        return result;
      },
      { concurrency: 10 }
    );

    console.log(`Successfully synced ${members.length} members`);

    return members;
  } catch (err) {
    console.log('error => ', err);
  }
};

async function refactorMember() {
  const members = await syncMembers();
}

refactorMember();
