import { Prisma } from '@prisma/client';

import { PAYOUTS } from '../../src/consts';

export const payoutData: Prisma.PayoutCreateManyInput[] = [
  {
    id: PAYOUTS[0],
    method: '$TXC-Cold',
    status: true,
    name: 'blockio',
    display: '$TXC-Cold',
  },
  {
    id: PAYOUTS[1],
    method: '$TXC-Hot',
    status: true,
    name: 'coin_payments',
    display: '$TXC-Hot',
  },
  {
    id: PAYOUTS[2],
    method: '$BTC',
    status: true,
    name: 'paypal',
    display: '$BTC Wallet Address',
  },
  {
    id: PAYOUTS[3],
    method: '$USDT',
    status: true,
    name: 'advcache',
    display: '$USDT Wallet Address',
  },
  {
    id: PAYOUTS[4],
    method: '$ETH',
    status: true,
    name: 'bitgo',
    display: '$ETH Wallet Address',
  },
  {
    id: PAYOUTS[5],
    method: '$Other',
    status: true,
    name: 'authorizenet',
    display: '$Other',
  },
];
