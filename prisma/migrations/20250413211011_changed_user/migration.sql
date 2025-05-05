-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "post_title" VARCHAR(50),
    "post_content" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_hash" VARCHAR(255),
    "user_salt" VARCHAR(255),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(15),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
