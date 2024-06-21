/*
  Warnings:

  - You are about to drop the column `statisticsId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user_statistics` table. All the data in the column will be lost.
  - Added the required column `from` to the `statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `user_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percent` to the `user_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statisticsId` to the `user_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_statisticsId_fkey";

-- DropIndex
DROP INDEX "index_sales_on_statisticsId";

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "statisticsId";

-- AlterTable
ALTER TABLE "statistics" ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "issuedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_statistics" DROP COLUMN "username",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "percent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "statisticsId" TEXT NOT NULL,
ALTER COLUMN "issuedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "index_blocks_on_block_number" ON "block"("blockNo");

-- CreateIndex
CREATE INDEX "index_memberStatistics_on_memberId" ON "user_statistics"("memberId");

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "statistics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
