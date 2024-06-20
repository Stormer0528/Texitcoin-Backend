/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "index_users_on_email";

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_username" ON "users"("username");
