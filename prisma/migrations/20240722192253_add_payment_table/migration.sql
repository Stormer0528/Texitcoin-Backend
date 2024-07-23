/*
  Warnings:

  - You are about to drop the column `address` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `sales` table. All the data in the column will be lost.
  - Added the required column `primaryAddress` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "address",
ADD COLUMN     "city" VARCHAR,
ADD COLUMN     "primaryAddress" VARCHAR NOT NULL,
ADD COLUMN     "secondaryAddress" VARCHAR,
ADD COLUMN     "state" VARCHAR,
ADD COLUMN     "zipCode" VARCHAR;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
