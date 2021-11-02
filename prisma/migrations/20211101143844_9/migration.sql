/*
  Warnings:

  - You are about to drop the column `pageId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Page` table. All the data in the column will be lost.
  - Added the required column `pageSlug` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pageId_fkey";

-- DropIndex
DROP INDEX "Page_slug_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "pageId",
ADD COLUMN     "pageSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
DROP COLUMN "id",
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("slug");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pageSlug_fkey" FOREIGN KEY ("pageSlug") REFERENCES "Page"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
