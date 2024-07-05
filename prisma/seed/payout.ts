import { Prisma } from '@prisma/client';

export const payoutData: Prisma.PayoutCreateManyInput[] = [
  {
    id: '6f7681f0-9ccf-4a79-b1cb-f87e56cf7e8a',
    method: '$TXC-Cold',
    status: true,
    name: 'blockio',
    display: '$TXC-Cold',
  },
  {
    id: 'b3ed0e78-6cc8-465c-9454-0576534f06f2',
    method: '$TXC-Hot',
    status: true,
    name: 'coin_payments',
    display: '$TXC-Hot',
  },
  {
    id: 'fc6302d9-7819-4cd6-a1a4-68b03286c86f',
    method: '$BTC',
    status: true,
    name: 'paypal',
    display: '$BTC Wallet Address',
  },
  {
    id: 'f8717a04-6203-482a-bed0-58bfb9c6f7e0',
    method: '$USDT',
    status: true,
    name: 'advcache',
    display: '$USDT Wallet Address',
  },
  {
    id: '69f1351c-e7c8-4c98-9030-2f0469f86b76',
    method: '$ETH',
    status: true,
    name: 'bitgo',
    display: '$ETH Wallet Address',
  },
  {
    id: 'ac26f196-d377-4846-8b86-7a7dda622d01',
    method: '$Other',
    status: true,
    name: 'authorizenet',
    display: '$Other',
  },
];
