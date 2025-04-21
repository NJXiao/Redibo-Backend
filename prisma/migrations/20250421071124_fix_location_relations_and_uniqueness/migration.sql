/*
  Warnings:

  - You are about to drop the column `id_carro` on the `CarasteristicasAdicionales` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `id_ciudad` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `id_pais` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Imagen` table. All the data in the column will be lost.
  - You are about to drop the `Combustible` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre,id_pais]` on the table `Ciudad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Pais` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,id_ciudad]` on the table `Provincia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_pais` to the `Ciudad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calle` to the `Direccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `Imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ciudad` to the `Provincia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarasteristicasAdicionales" DROP CONSTRAINT "CarasteristicasAdicionales_id_carro_fkey";

-- DropForeignKey
ALTER TABLE "Combustible" DROP CONSTRAINT "Combustible_id_carro_fkey";

-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_id_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_id_pais_fkey";

-- AlterTable
ALTER TABLE "CarasteristicasAdicionales" DROP COLUMN "id_carro";

-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "Ciudad" ADD COLUMN     "id_pais" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Direccion" DROP COLUMN "direccion",
DROP COLUMN "id_ciudad",
DROP COLUMN "id_pais",
ADD COLUMN     "calle" TEXT NOT NULL,
ADD COLUMN     "zona" TEXT,
ALTER COLUMN "num_casa" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Imagen" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Provincia" ADD COLUMN     "id_ciudad" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Combustible";

-- CreateTable
CREATE TABLE "CombustibleCarro" (
    "id" SERIAL NOT NULL,
    "id_carro" INTEGER NOT NULL,
    "id_combustible" INTEGER NOT NULL,

    CONSTRAINT "CombustibleCarro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCombustible" (
    "id" SERIAL NOT NULL,
    "tipoDeCombustible" TEXT NOT NULL,
    "id_carro" INTEGER NOT NULL,

    CONSTRAINT "TipoCombustible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicasAdicionalesCarro" (
    "id" SERIAL NOT NULL,
    "id_carro" INTEGER NOT NULL,
    "id_carasteristicasAdicionales" INTEGER NOT NULL,

    CONSTRAINT "caracteristicasAdicionalesCarro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "id_direccion" INTEGER NOT NULL,
    "coordenadas" JSONB NOT NULL,
    "radio_cobertura" INTEGER NOT NULL DEFAULT 5000,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ciudad_nombre_pais_uq" ON "Ciudad"("nombre", "id_pais");

-- CreateIndex
CREATE UNIQUE INDEX "Pais_nombre_key" ON "Pais"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Provincia_nombre_ciudad_uq" ON "Provincia"("nombre", "id_ciudad");

-- AddForeignKey
ALTER TABLE "CombustibleCarro" ADD CONSTRAINT "CombustibleCarro_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombustibleCarro" ADD CONSTRAINT "CombustibleCarro_id_combustible_fkey" FOREIGN KEY ("id_combustible") REFERENCES "TipoCombustible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_carasteristicasAdiciona_fkey" FOREIGN KEY ("id_carasteristicasAdicionales") REFERENCES "CarasteristicasAdicionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciudad" ADD CONSTRAINT "Ciudad_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
