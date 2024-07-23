/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "avatar" TEXT DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcrrCHjN9kChJVJtWxXCHoUcgEhxWwTclnURuK20T8EDX_rVt0NMik5tYpLhKzqPBnvP0&usqp=CAU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "index_admins_on_username" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "index_admins_on_email" ON "admins"("email");

-- RenameIndex
ALTER INDEX "index_users_on_userId" RENAME TO "index_members_on_userId";
