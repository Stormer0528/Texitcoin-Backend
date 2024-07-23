/*
  Warnings:

  - You are about to drop the column `paymentMethodId` on the `sales` table. All the data in the column will be lost.
  - Added the required column `paymentId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "paymentMethodId",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
