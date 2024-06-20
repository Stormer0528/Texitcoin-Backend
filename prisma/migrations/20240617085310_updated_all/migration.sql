/*
  Warnings:

  - Made the column `userId` on table `sales` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "userId" SET NOT NULL;
