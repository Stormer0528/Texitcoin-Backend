/*
  Warnings:

  - You are about to drop the column `from` on the `statistics_sale` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `statistics_sale` table. All the data in the column will be lost.
  - Added the required column `selected` to the `statistics_sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "statistics_sale" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "selected" BOOLEAN NOT NULL;
