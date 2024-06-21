import { PrismaClient } from '@prisma/client';

import { rpcCommand } from '@/utils/rpcCommand';
import { GET_BLOCK_COUNT, GET_BLOCK_HASH, GET_BLOCK } from '@/consts';

const prisma = new PrismaClient();

const getBlockCountFromDatabase = async () => {
  try {
    const { blockNo } = await prisma.block.findFirst({ orderBy: { createdAt: 'desc' } });

    return blockNo;
  } catch (err) {
    console.log('error => ', err);
  }
};

const createBlocks = async (data) => {
  try {
    const result = await prisma.block.createMany({ data });

    console.log('Created blocks');

    return result;
  } catch (err) {
    console.log('error => ', err);
  }
};

export const syncBlocks = async () => {
  console.log('Syncing block');
  console.log('Connecting to PostgreSQL database');

  const [block = 0, count] = await Promise.all([
    getBlockCountFromDatabase(),
    rpcCommand({ method: GET_BLOCK_COUNT }),
  ]);

  const arr = Array.from({ length: count - block }, (_, index) => block + index + 1);

  const blocks = arr.map(async (item) => {
    const [hash] = await Promise.all([rpcCommand({ method: GET_BLOCK_HASH, params: [item] })]);

    const { height, time } = await rpcCommand({ method: GET_BLOCK, params: [hash] });

    const createdAt = time.toLocaleString().toISOString().split('T')[0];

    return { blockNo: height, createdAt, updatedAt: createdAt };
  });

  await createBlocks(blocks);
};
