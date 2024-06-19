import { getStatistics, getUserStatistics } from './importData';
import { getUsers, getSales } from './connectMlm';

const mineStats = [
  {
    issuedAt: new Date('2024-06-07'),
    newBlocks: 300,
    totalBlocks: 300,
  },
  {
    issuedAt: new Date('2024-06-12'),
    newBlocks: 300,
    totalBlocks: 600,
  },
  {
    issuedAt: new Date('2024-06-13'),
    newBlocks: 350,
    totalBlocks: 950,
  },
  {
    issuedAt: new Date('2024-06-14'),
    newBlocks: 300,
    totalBlocks: 1250,
  },
  {
    issuedAt: new Date('2024-06-16'),
    newBlocks: 350,
    totalBlocks: 1600,
  },
];

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  const sales = await getSales();

  const statistics = await getStatistics(sales, mineStats);

  return statistics;
};

// get users from login on mlm
export const getUserFromMlm = async () => {
  const users = await getUsers();

  return users;
};

// get user_statistics from login, package and puchase_history on mlm
export const getUserStatisticsFromMlm = async () => {
  const sales = await getSales();

  // const userStatistics = await getUserStatistics(sales, mineStats);

  return sales;
};
