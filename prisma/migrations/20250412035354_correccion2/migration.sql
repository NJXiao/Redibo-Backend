/*
  Warnings:

  - You are about to drop the column `id_carro` on the `CarasteristicasAdicionales` table. All the data in the column will be lost.
  - You are about to drop the `Combustible` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarasteristicasAdicionales" DROP CONSTRAINT "CarasteristicasAdicionales_id_carro_fkey";

-- DropForeignKey
ALTER TABLE "Combustible" DROP CONSTRAINT "Combustible_id_carro_fkey";

-- AlterTable
ALTER TABLE "CarasteristicasAdicionales" DROP COLUMN "id_carro";

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

-- AddForeignKey
ALTER TABLE "CombustibleCarro" ADD CONSTRAINT "CombustibleCarro_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombustibleCarro" ADD CONSTRAINT "CombustibleCarro_id_combustible_fkey" FOREIGN KEY ("id_combustible") REFERENCES "TipoCombustible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_carasteristicasAdiciona_fkey" FOREIGN KEY ("id_carasteristicasAdicionales") REFERENCES "CarasteristicasAdicionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
