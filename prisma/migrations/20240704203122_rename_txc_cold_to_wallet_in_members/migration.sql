/*
  Warnings:

  - You are about to drop the column `txcCold` on the `members` table. All the data in the column will be lost.
  - Added the required column `wallet` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "txcCold",
ADD COLUMN     "wallet" VARCHAR NOT NULL;
