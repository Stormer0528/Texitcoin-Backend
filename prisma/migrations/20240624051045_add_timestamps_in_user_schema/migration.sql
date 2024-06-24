/*
  Warnings:

  - You are about to drop the `user_statistics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_statistics" DROP CONSTRAINT "user_statistics_memberId_fkey";

-- DropForeignKey
ALTER TABLE "user_statistics" DROP CONSTRAINT "user_statistics_statisticsId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "user_statistics";

-- CreateTable
CREATE TABLE "member_statistics" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "txcShared" DOUBLE PRECISION NOT NULL,
    "hashPower" INTEGER NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "member_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_memberStatistics_on_memberId" ON "member_statistics"("memberId");

-- AddForeignKey
ALTER TABLE "member_statistics" ADD CONSTRAINT "member_statistics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_statistics" ADD CONSTRAINT "member_statistics_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "statistics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
