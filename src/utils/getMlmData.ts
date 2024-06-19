import { getStatistics, getUserStatistics } from './importData';
import { getUsers, getSales } from './connectMlm';

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  console.log('getStatisticsFromMlm');

  const sales = await getSales();

  const mineStats = [];

  const statistics = await getStatistics(sales, mineStats);

  return statistics;
};

// get users from login on mlm
export const getUserFromMlm = async () => {
  console.log('getUserFromMlm');

  const users = await getUsers();

  return users;
};

// get user_statistics from login, package and puchase_history on mlm
export const getUserStatisticsFromMlm = async () => {
  console.log('getUserStatisticsFromMlm');

  const sales = await getSales();

  const mineStats = [];

  // const userStatistics = await getUserStatistics(sales, mineStats);

  return sales;
};
