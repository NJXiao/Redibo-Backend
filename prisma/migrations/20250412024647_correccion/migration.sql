/*
  Warnings:

  - You are about to drop the column `direccion` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `id_ciudad` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `id_pais` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Imagen` table. All the data in the column will be lost.
  - You are about to drop the column `id_ciudad` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Ciudad` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `calle` to the `Direccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zona` to the `Direccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `Imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_departamento` to the `Provincia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_departamento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_id_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_id_pais_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_ciudad_fkey";

-- AlterTable
ALTER TABLE "Direccion" DROP COLUMN "direccion",
DROP COLUMN "id_ciudad",
DROP COLUMN "id_pais",
ADD COLUMN     "calle" TEXT NOT NULL,
ADD COLUMN     "zona" TEXT NOT NULL,
ALTER COLUMN "num_casa" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Imagen" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Provincia" ADD COLUMN     "id_departamento" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "id_ciudad",
ADD COLUMN     "id_departamento" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Ciudad";

-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_pais" INTEGER NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "id_direccion" INTEGER NOT NULL,
    "id_departamento" INTEGER NOT NULL,
    "coordenadas" JSONB NOT NULL,
    "radio_cobertura" INTEGER NOT NULL DEFAULT 5000,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
