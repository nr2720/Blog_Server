/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `dislikes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[post_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dislikes_post_id_key" ON "dislikes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_post_id_key" ON "likes"("post_id");
