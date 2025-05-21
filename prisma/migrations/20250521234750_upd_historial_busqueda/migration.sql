-- DropForeignKey
ALTER TABLE "Busqueda" DROP CONSTRAINT "Busqueda_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "busquedas" TEXT;
