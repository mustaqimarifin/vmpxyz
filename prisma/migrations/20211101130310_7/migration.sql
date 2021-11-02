/*
  Warnings:

  - You are about to drop the column `url` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Page_url_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "url",
ADD COLUMN     "slug" VARCHAR(128) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
