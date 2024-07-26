import DataLoader from 'dataloader';

import RootDataLoader from '.';
import { Member } from '@prisma/client';

// export const membersForPayoutLoader = (parent: RootDataLoader) => {
//   return new DataLoader<string, Member[]>(
//     async (payoutIds: string[]) => {
//       const payoutsWithMembers = await parent.prisma.payout.findMany({
//         select: {
//           id: true,
//           members: true,
//         },
//         where: { id: { in: payoutIds } },
//       });

//       const payoutsWithMembersMap: Record<string, Member[]> = {};
//       payoutsWithMembers.forEach(({ id, members }) => {
//         payoutsWithMembersMap[id] = members;
//       });

//       return payoutIds.map((id) => payoutsWithMembersMap[id]);
//     },
//     {
//       ...parent.dataLoaderOptions,
//     }
//   );
// };
