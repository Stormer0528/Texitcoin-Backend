/*
  Warnings:

  - You are about to alter the column `percent` on the `member_statistics` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `percent` on the `memberwallets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "member_statistics" ALTER COLUMN "percent" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "memberwallets" ALTER COLUMN "percent" SET DATA TYPE INTEGER;
