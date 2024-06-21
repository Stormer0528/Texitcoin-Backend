/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_userId" ON "members"("userId");
