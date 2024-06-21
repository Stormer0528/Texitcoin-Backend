import { getMembers, getSales } from './connectMlm';
import { processStatistics, processMemberStatistics } from './processData';

const issuedAt = new Date();

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  const sales = await getSales();

  const statistics = await processStatistics(sales);

  return statistics;
};

// get members from login on mlm
export const getMemberFromMlm = async () => {
  const members = await getMembers();

  return members;
};

// get member_statistics from login, package and puchase_history on mlm
export const getMemberStatisticsFromMlm = async () => {
  const sales = await getSales();

  const memberStatistics = await processMemberStatistics(sales);

  return memberStatistics;
};
