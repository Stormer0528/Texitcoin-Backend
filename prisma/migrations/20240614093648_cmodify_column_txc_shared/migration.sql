/*
  Warnings:

  - You are about to drop the column `txcShared` on the `user_statistics` table. All the data in the column will be lost.
  - Added the required column `blocks` to the `user_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_statistics" DROP COLUMN "txcShared",
ADD COLUMN     "blocks" INTEGER NOT NULL;
