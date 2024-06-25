/*
  Warnings:

  - You are about to drop the column `fullname` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `issuedAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `sales` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_memberId_fkey";

-- DropIndex
DROP INDEX "index_sales_on_username";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "fullname",
ADD COLUMN     "fullName" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "issuedAt",
DROP COLUMN "username",
ADD COLUMN     "orderedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
