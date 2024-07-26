/*
  Warnings:

  - You are about to drop the column `sponsorid` on the `members` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_sponsorid_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "sponsorid",
ADD COLUMN     "sponsorId" VARCHAR;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
