/*
  Warnings:

  - You are about to drop the column `slug` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `pageId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Comment_slug_key";

-- DropIndex
DROP INDEX "Page_slug_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "slug",
ADD COLUMN     "pageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
