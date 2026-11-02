/*
  Warnings:

  - The primary key for the `huesped` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[nombre_permiso]` on the table `permiso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre_rol]` on the table `rol` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id_huesped` on the `huesped` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_huesped` on the `reserva` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "reserva_id_huesped_fkey";

-- AlterTable
ALTER TABLE "bitacora" ALTER COLUMN "registro_id" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "huesped" DROP CONSTRAINT "huesped_pkey",
DROP COLUMN "id_huesped",
ADD COLUMN     "id_huesped" UUID NOT NULL,
ADD CONSTRAINT "huesped_pkey" PRIMARY KEY ("id_huesped");

-- AlterTable
ALTER TABLE "reserva" DROP COLUMN "id_huesped",
ADD COLUMN     "id_huesped" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permiso_nombre_permiso_key" ON "permiso"("nombre_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_rol_key" ON "rol"("nombre_rol");

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_huesped_fkey" FOREIGN KEY ("id_huesped") REFERENCES "huesped"("id_huesped") ON DELETE RESTRICT ON UPDATE CASCADE;
