/*
  Warnings:

  - You are about to drop the column `paymentId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentMethod` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_paymentId_fkey";

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "paymentId",
ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- DropTable
DROP TABLE "payments";
