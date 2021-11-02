/*
  Warnings:

  - You are about to drop the column `url` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Comment_url_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "url",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_slug_key" ON "Comment"("slug");
