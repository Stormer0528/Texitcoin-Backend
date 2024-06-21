/*
  Warnings:

  - You are about to drop the column `difficulty` on the `statistics` table. All the data in the column will be lost.
  - You are about to drop the column `hashRate` on the `statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "statistics" DROP COLUMN "difficulty",
DROP COLUMN "hashRate";
