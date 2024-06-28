/*
  Warnings:

  - You are about to drop the column `Date` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `Token` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `sales` table. All the data in the column will be lost.
  - Added the required column `token` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "Date",
DROP COLUMN "Token",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "token" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "amount",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "statistics" ALTER COLUMN "status" SET DEFAULT true;
