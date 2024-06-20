import { processStatistics, processMemberStatistics } from './importData';
import { getMembers, getSales } from './connectMlm';
import { getBlockCount } from './getBlockCount';

const issuedAt = new Date();

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  const [newBlocks] = await Promise.all([getBlockCount()]);
  const sales = await getSales();

  const statistics = await processStatistics(sales, { newBlocks, issuedAt });

  return statistics;
};

// get members from login on mlm
export const getMemberFromMlm = async () => {
  const members = await getMembers();

  return members;
};

// get member_statistics from login, package and puchase_history on mlm
export const getMemberStatisticsFromMlm = async () => {
  const [newBlocks] = await Promise.all([getBlockCount()]);
  const sales = await getSales();

  const memberStatistics = await processMemberStatistics(sales, { newBlocks, issuedAt });

  return memberStatistics;
};
