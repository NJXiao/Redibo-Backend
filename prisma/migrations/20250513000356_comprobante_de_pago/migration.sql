-- CreateTable
CREATE TABLE "ComprobanteDePago" (
    "id" SERIAL NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_orden" INTEGER NOT NULL,
    "numero_transaccion" TEXT NOT NULL,

    CONSTRAINT "ComprobanteDePago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComprobanteDePago" ADD CONSTRAINT "ComprobanteDePago_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "OrdenPago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
