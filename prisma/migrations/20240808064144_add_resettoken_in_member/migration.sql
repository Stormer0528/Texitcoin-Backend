/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "token" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "index_members_on_token" ON "members"("token");
