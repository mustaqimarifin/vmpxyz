/*
  Warnings:

  - You are about to drop the column `pageSlug` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pageId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Page` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pageSlug_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "pageSlug",
ADD COLUMN     "pageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_PageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PageToUser_AB_unique" ON "_PageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PageToUser_B_index" ON "_PageToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToUser" ADD FOREIGN KEY ("A") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
