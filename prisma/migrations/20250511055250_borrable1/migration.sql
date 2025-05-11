/*
  Warnings:

  - A unique constraint covering the columns `[id_condiciones_uso]` on the table `Carro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "calificacionpromedio" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "id_condiciones_uso" INTEGER,
ADD COLUMN     "notificaion_confirmacion_id" INTEGER;

-- AlterTable
ALTER TABLE "SeguroCarro" ADD COLUMN     "enlace" VARCHAR(255);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT,
    "id_comentariorespondido" INTEGER,
    "comentado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER,
    "id_usuariorol" INTEGER,
    "id_carro" INTEGER,
    "id_calificacion" INTEGER,
    "likes" INTEGER,
    "dont_likes" INTEGER,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condiciones_generales" (
    "id" SERIAL NOT NULL,
    "edad_minima" INTEGER NOT NULL,
    "edad_maxima" INTEGER NOT NULL,
    "kilometraje_max_dia" DOUBLE PRECISION NOT NULL,
    "fumar" BOOLEAN NOT NULL,
    "mascota" BOOLEAN NOT NULL,
    "dev_mismo_conb" BOOLEAN NOT NULL,
    "uso_fuera_ciudad" BOOLEAN NOT NULL,
    "multa_conductor" BOOLEAN NOT NULL,
    "dev_mismo_lugar" BOOLEAN NOT NULL,
    "uso_comercial" BOOLEAN NOT NULL,

    CONSTRAINT "condiciones_generales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condiciones_uso" (
    "id" SERIAL NOT NULL,
    "id_condiciones_generales" INTEGER,
    "id_devolucion_auto" INTEGER,
    "id_entrega_auto" INTEGER,

    CONSTRAINT "condiciones_uso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucion_auto" (
    "id" SERIAL NOT NULL,
    "interior_limpio" BOOLEAN NOT NULL,
    "exterior_limpio" BOOLEAN NOT NULL,
    "rayones" BOOLEAN NOT NULL,
    "herramientas" BOOLEAN NOT NULL,
    "cobrar_daños" BOOLEAN NOT NULL,
    "combustible_igual" BOOLEAN NOT NULL,

    CONSTRAINT "devolucion_auto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrega_auto" (
    "id" SERIAL NOT NULL,
    "estado_combustible" VARCHAR(255) NOT NULL,
    "esterior_limpio" BOOLEAN NOT NULL,
    "inter_limpio" BOOLEAN NOT NULL,
    "rayones" BOOLEAN NOT NULL,
    "llanta_estado" BOOLEAN NOT NULL,
    "interior_daño" BOOLEAN NOT NULL,

    CONSTRAINT "entrega_auto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "herramientas_basicas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "id_entrega_auto" INTEGER NOT NULL,

    CONSTRAINT "herramientas_basicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaion_confirmacion" (
    "id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN,
    "id_renter" INTEGER,
    "id_host" INTEGER,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiposeguro" (
    "id" SERIAL NOT NULL,
    "tipodaño" VARCHAR(255),
    "descripcion" TEXT,
    "segurocarro_id" INTEGER,
    "valides" VARCHAR(255),

    CONSTRAINT "tiposeguro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "condiciones_uso_id_condiciones_generales_key" ON "condiciones_uso"("id_condiciones_generales");

-- CreateIndex
CREATE UNIQUE INDEX "condiciones_uso_id_devolucion_auto_key" ON "condiciones_uso"("id_devolucion_auto");

-- CreateIndex
CREATE UNIQUE INDEX "condiciones_uso_id_entrega_auto_key" ON "condiciones_uso"("id_entrega_auto");

-- CreateIndex
CREATE UNIQUE INDEX "uq_carro_condiciones_uso" ON "Carro"("id_condiciones_uso");

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_id_condiciones_uso_fkey" FOREIGN KEY ("id_condiciones_uso") REFERENCES "condiciones_uso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_comentariorespondido_fkey" FOREIGN KEY ("id_comentariorespondido") REFERENCES "comentarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_usuariorol_fkey" FOREIGN KEY ("id_usuariorol") REFERENCES "UsuarioRol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "id_calificacion" FOREIGN KEY ("id_calificacion") REFERENCES "Calificacion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "id_carro" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "condiciones_uso" ADD CONSTRAINT "condiciones_uso_id_condiciones_generales_fkey" FOREIGN KEY ("id_condiciones_generales") REFERENCES "condiciones_generales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condiciones_uso" ADD CONSTRAINT "condiciones_uso_id_devolucion_auto_fkey" FOREIGN KEY ("id_devolucion_auto") REFERENCES "devolucion_auto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condiciones_uso" ADD CONSTRAINT "condiciones_uso_id_entrega_auto_fkey" FOREIGN KEY ("id_entrega_auto") REFERENCES "entrega_auto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiposeguro" ADD CONSTRAINT "tiposeguro_segurocarro_id_fkey" FOREIGN KEY ("segurocarro_id") REFERENCES "SeguroCarro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
