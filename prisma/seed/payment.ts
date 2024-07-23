import { Prisma } from '@prisma/client';

export const paymentData: Prisma.PaymentCreateManyInput[] = [
  {
    id: '813e4bac-d3ab-4b2f-b3ab-80472ea2b8c9',
    name: 'Zelle',
    status: true,
  },
  {
    id: 'a36e157f-22e1-443b-b0fc-2c5870cb401c',
    name: 'CashApp',
    status: true,
  },
  {
    id: '12a01037-6298-4ce5-ac08-3876c6925945',
    name: 'Venmo',
    status: true,
  },
  {
    id: 'de341423-afbe-4378-9150-b05a1a93aabe',
    name: 'Paper Check',
    status: true,
  },
  {
    id: '49fb4b98-70d6-4183-9927-89d32992aca4',
    name: 'Cash',
    status: true,
  },
  {
    id: 'e88a37b2-b54f-4bfd-b4dc-6d0e0b4f8661',
    name: 'Kilo Of Silver',
    status: true,
  },
  {
    id: 'ad3d6b3b-f3c7-485c-81f1-6f76357fa18c',
    name: 'Free',
    status: true,
  },
  {
    id: '5b7d11c2-2fa5-4f44-bc6f-05645c76b73c',
    name: 'admin',
    status: true,
  },
  {
    id: '8c7202d5-1df7-422a-a02d-62deb3cce02f',
    name: 'Free_package',
    status: true,
  },
  {
    id: '9ca0adb6-b424-45dd-8a1b-8aec4a117cd7',
    name: 'Register_from_admin',
    status: true,
  },
];
