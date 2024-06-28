/*
  Warnings:

  - You are about to drop the column `productName` on the `sales` table. All the data in the column will be lost.
  - Added the required column `packageId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" DROP COLUMN "productName",
ADD COLUMN     "packageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Token" INTEGER NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_sales_on_packageId" ON "sales"("packageId");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
