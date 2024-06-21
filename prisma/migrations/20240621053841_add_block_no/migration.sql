/*
  Warnings:

  - Added the required column `blockNo` to the `block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "block" ADD COLUMN     "blockNo" INTEGER NOT NULL;
