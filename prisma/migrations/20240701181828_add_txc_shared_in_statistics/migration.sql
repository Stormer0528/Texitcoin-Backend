/*
  Warnings:

  - Added the required column `txcShared` to the `statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "statistics" ADD COLUMN     "txcShared" INTEGER NOT NULL;
