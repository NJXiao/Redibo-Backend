/*
  Warnings:

  - You are about to drop the column `enlace` on the `SeguroCarro` table. All the data in the column will be lost.
  - You are about to drop the column `valides` on the `tiposeguro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SeguroCarro" DROP COLUMN "enlace",
ADD COLUMN     "enlaceSeguro" TEXT;

-- AlterTable
ALTER TABLE "tiposeguro" DROP COLUMN "valides",
ADD COLUMN     "cantidadCobertura" VARCHAR(255);
