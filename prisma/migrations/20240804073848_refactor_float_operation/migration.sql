/*
  Warnings:

  - You are about to alter the column `txcShared` on the `member_statistics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `percent` on the `member_statistics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `txc` on the `memberstatisticswallets` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `percent` on the `memberwallets` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "member_statistics" ALTER COLUMN "txcShared" SET DATA TYPE BIGINT,
ALTER COLUMN "percent" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "memberstatisticswallets" ALTER COLUMN "txc" SET DEFAULT 0,
ALTER COLUMN "txc" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "memberwallets" ALTER COLUMN "percent" SET DEFAULT 0,
ALTER COLUMN "percent" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "statistics" ALTER COLUMN "txcShared" SET DATA TYPE BIGINT;
