import { processStatistics, processUserStatistics } from './importData';
import { getUsers, getSales } from './connectMlm';
import { getBlockCount } from './getBlockCount';

const issuedAt = new Date();

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  const [newBlocks] = await Promise.all([getBlockCount()]);
  const sales = await getSales();

  const statistics = await processStatistics(sales, { newBlocks, issuedAt });

  return statistics;
};

// get users from login on mlm
export const getUserFromMlm = async () => {
  const users = await getUsers();

  return users;
};

// get user_statistics from login, package and puchase_history on mlm
export const getUserStatisticsFromMlm = async () => {
  const [newBlocks] = await Promise.all([getBlockCount()]);
  const sales = await getSales();

  const userStatistics = await processUserStatistics(sales, { newBlocks, issuedAt });

  return userStatistics;
};
