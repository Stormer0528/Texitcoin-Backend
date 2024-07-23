/*
  Warnings:

  - Added the required column `password` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members"
ADD COLUMN     "password" VARCHAR NOT NULL;
