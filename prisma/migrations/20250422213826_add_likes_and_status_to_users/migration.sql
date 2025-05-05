-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "dislikes" INTEGER,
ADD COLUMN     "likes" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" VARCHAR(50) NOT NULL DEFAULT 'user';
