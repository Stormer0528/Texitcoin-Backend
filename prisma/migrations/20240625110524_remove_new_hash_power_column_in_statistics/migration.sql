/*
  Warnings:

  - You are about to drop the column `members` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `newHashPower` on the `statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "statistics" DROP COLUMN "members",
DROP COLUMN "newHashPower",
ADD COLUMN     "totalMembers" INTEGER;
