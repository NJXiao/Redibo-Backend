-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'CANCELADO');

-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "OrdenPago" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "id_usuario_host" INTEGER NOT NULL,
    "id_usuario_renter" INTEGER NOT NULL,
    "id_carro" INTEGER NOT NULL,
    "fecha_de_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto_a_pagar" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "OrdenPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdenPago_codigo_key" ON "OrdenPago"("codigo");

-- AddForeignKey
ALTER TABLE "OrdenPago" ADD CONSTRAINT "OrdenPago_id_usuario_host_fkey" FOREIGN KEY ("id_usuario_host") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenPago" ADD CONSTRAINT "OrdenPago_id_usuario_renter_fkey" FOREIGN KEY ("id_usuario_renter") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenPago" ADD CONSTRAINT "OrdenPago_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
