/*
  Warnings:

  - You are about to drop the column `payoutId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `members` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_payoutId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "payoutId",
DROP COLUMN "wallet";

-- CreateTable
CREATE TABLE "memberwallets" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "payoutId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "memberwallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberstatisticswallets" (
    "id" TEXT NOT NULL,
    "memberStatisticId" TEXT NOT NULL,
    "memberWalletId" TEXT NOT NULL,
    "txc" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "memberstatisticswallets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "memberwallets" ADD CONSTRAINT "memberwallets_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberwallets" ADD CONSTRAINT "memberwallets_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "payouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberstatisticswallets" ADD CONSTRAINT "memberstatisticswallets_memberStatisticId_fkey" FOREIGN KEY ("memberStatisticId") REFERENCES "member_statistics"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberstatisticswallets" ADD CONSTRAINT "memberstatisticswallets_memberWalletId_fkey" FOREIGN KEY ("memberWalletId") REFERENCES "memberwallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
