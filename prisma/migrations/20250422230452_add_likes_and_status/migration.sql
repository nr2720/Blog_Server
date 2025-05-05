/*
  Warnings:

  - You are about to drop the column `dislikes` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "post_id" INTEGER,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dislikes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "post_id" INTEGER,

    CONSTRAINT "dislikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dislikes" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dislikes" ADD CONSTRAINT "fk_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
