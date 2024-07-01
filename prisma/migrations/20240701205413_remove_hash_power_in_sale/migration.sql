/*
  Warnings:

  - You are about to drop the column `hashPower` on the `sales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sales" DROP COLUMN "hashPower";

-- AlterTable
ALTER TABLE "statistics" ALTER COLUMN "txcShared" SET DEFAULT 0;
