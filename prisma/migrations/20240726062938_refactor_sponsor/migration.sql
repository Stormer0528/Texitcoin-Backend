/*
  Warnings:

  - You are about to drop the column `sponsorName` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "sponsorName",
ADD COLUMN     "sponsorid" VARCHAR;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sponsorid_fkey" FOREIGN KEY ("sponsorid") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
