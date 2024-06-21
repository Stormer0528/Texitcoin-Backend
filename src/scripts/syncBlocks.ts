import { PrismaClient } from '@prisma/client';

import { rpcCommand } from '../utils/rpcCommand';
import { GET_BLOCK_COUNT, GET_BLOCK_HASH, GET_BLOCK, GET_NETWORK_HASH_PS } from '../consts';

const prisma = new PrismaClient();

const getBlockCountFromDatabase = async () => {
  try {
    const block = await prisma.block.findFirst({ orderBy: { blockNo: 'desc' } });

    return block ? block.blockNo : 0;
  } catch (err) {
    console.log('error => ', err);
  }
};

const createBlocks = async (data) => {
  try {
    const result = await prisma.block.createMany({ data });

    console.log('Synced blocks');

    return result;
  } catch (err) {
    console.log('error => ', err);
  }
};

export const syncBlocks = async () => {
  try {
    console.log('Syncing block');
    console.log('Connecting to PostgreSQL database');

    const [block, count] = await Promise.all([
      getBlockCountFromDatabase(),
      rpcCommand({ method: GET_BLOCK_COUNT }),
    ]);

    const arr = Array.from({ length: count - block }, (_, index) => block + index + 1);

    const blocks = await Promise.all(
      arr.map(async (item) => {
        const [hash] = await Promise.all([rpcCommand({ method: GET_BLOCK_HASH, params: [item] })]);

        const [{ height, time, difficulty }] = await Promise.all([
          await rpcCommand({
            method: GET_BLOCK,
            params: [hash],
          }),
        ]);

        console.log('height => ', height);

        const hashRate = await rpcCommand({ method: GET_NETWORK_HASH_PS, params: [120, height] });

        const createdAt = new Date(time * 1000);

        return { blockNo: height, difficulty, hashRate, createdAt, updatedAt: createdAt };
      })
    );

    await createBlocks(blocks);
  } catch (err) {
    console.log('error => ', err);
  }
};
