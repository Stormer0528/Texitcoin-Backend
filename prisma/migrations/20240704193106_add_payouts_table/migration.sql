/*
  Warnings:

  - You are about to drop the column `txcPayout` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "txcPayout",
ADD COLUMN     "payoutId" TEXT;

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
