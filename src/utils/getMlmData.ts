import { rpcCommand } from './rpcCommand';
import { getMembers, getSales } from './connectMlm';
import { GET_BLOCK_COUNT, GET_DIFFICULTY } from 'src/consts';
import { processStatistics, processMemberStatistics } from './processData';

const issuedAt = new Date();

// get statistics from login, package and purchase_history on mlm
export const getStatisticsFromMlm = async () => {
  // const [newBlocks, difficulty] = await Promise.all([rpcComand(GET_BLOCK_COUNT), rpcCommand(GET_DIFFICULTY)]);
  const newBlocks = 300;
  const difficulty = 600;

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
  // const [newBlocks] = await Promise.all([rpcCommand('getblockcount')]);
  const newBlocks = 300;
  const sales = await getSales();

  const memberStatistics = await processMemberStatistics(sales, {
    newBlocks,
    issuedAt,
  });

  return memberStatistics;
};
