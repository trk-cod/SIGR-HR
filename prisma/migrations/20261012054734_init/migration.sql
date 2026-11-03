-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(50) NOT NULL,
    "contrasena_usuario" VARCHAR(255) NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "ultimo_acceso" TIMESTAMP(3),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id_permiso" SERIAL NOT NULL,
    "nombre_permiso" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "rol_permiso" (
    "id_rol_permiso" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "rol_permiso_pkey" PRIMARY KEY ("id_rol_permiso")
);

-- CreateTable
CREATE TABLE "bitacora" (
    "id_bitacora" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "accion" VARCHAR(100) NOT NULL,
    "tabla_afectada" VARCHAR(100) NOT NULL,
    "registro_id" INTEGER,
    "descripcion" VARCHAR(300),
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_equipo" VARCHAR(45),

    CONSTRAINT "bitacora_pkey" PRIMARY KEY ("id_bitacora")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id_cargo" SERIAL NOT NULL,
    "nombre_car" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),
    "sueldo_base" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id_cargo")
);

-- CreateTable
CREATE TABLE "empleado" (
    "id_empleado" SERIAL NOT NULL,
    "nombre_em" VARCHAR(100) NOT NULL,
    "apellido_em" VARCHAR(100) NOT NULL,
    "cedula_em" VARCHAR(20) NOT NULL,
    "fecha_nac_emp" DATE NOT NULL,
    "sexo" BOOLEAN,
    "telefono_em" VARCHAR(20),
    "correo_em" VARCHAR(100),
    "direccion_em" VARCHAR(100),
    "id_cargo" INTEGER NOT NULL,
    "fecha_ingreso" DATE NOT NULL,
    "salario_actual" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "huesped" (
    "id_huesped" SERIAL NOT NULL,
    "nombre_hu" VARCHAR(100) NOT NULL,
    "apellido_hu" VARCHAR(100) NOT NULL,
    "identificacion_hu" VARCHAR(30) NOT NULL,
    "telefono_hu" VARCHAR(20),
    "correo_hu" VARCHAR(100),
    "direccion_hu" VARCHAR(200),
    "nacionalidad_hu" VARCHAR(50),
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "huesped_pkey" PRIMARY KEY ("id_huesped")
);

-- CreateTable
CREATE TABLE "estado_habitacion" (
    "id_est_habitacion" SERIAL NOT NULL,
    "nombre_estado" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(200),

    CONSTRAINT "estado_habitacion_pkey" PRIMARY KEY ("id_est_habitacion")
);

-- CreateTable
CREATE TABLE "tipo_habitacion" (
    "id_thabitacion" SERIAL NOT NULL,
    "nombre_tipo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),
    "capacidad" INTEGER NOT NULL,
    "cantidad_camas" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipo_habitacion_pkey" PRIMARY KEY ("id_thabitacion")
);

-- CreateTable
CREATE TABLE "habitacion" (
    "id_habitacion" SERIAL NOT NULL,
    "numero_habitacion" VARCHAR(10) NOT NULL,
    "piso" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_est_habitacion" INTEGER NOT NULL,
    "descripcion" VARCHAR(200),
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habitacion_pkey" PRIMARY KEY ("id_habitacion")
);

-- CreateTable
CREATE TABLE "tarifa" (
    "id_tarifa" SERIAL NOT NULL,
    "id_thabitacion" INTEGER NOT NULL,
    "nombre_temporada" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(250),
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "precio_noche" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tarifa_pkey" PRIMARY KEY ("id_tarifa")
);

-- CreateTable
CREATE TABLE "historial_habitacion" (
    "id_historial" SERIAL NOT NULL,
    "id_habitacion" INTEGER NOT NULL,
    "id_est_habitacion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "observaciones" VARCHAR(300),
    "id_empleado" INTEGER NOT NULL,

    CONSTRAINT "historial_habitacion_pkey" PRIMARY KEY ("id_historial")
);

-- CreateTable
CREATE TABLE "mantenimiento" (
    "id_mantenimiento" SERIAL NOT NULL,
    "id_habitacion" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "tipo_mantenimiento" VARCHAR(30) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "descripcion" VARCHAR(300) NOT NULL,
    "costo" DECIMAL(10,2),
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "mantenimiento_pkey" PRIMARY KEY ("id_mantenimiento")
);

-- CreateTable
CREATE TABLE "estado_reserva" (
    "id_est_reserva" SERIAL NOT NULL,
    "nombre_est_res" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(200),

    CONSTRAINT "estado_reserva_pkey" PRIMARY KEY ("id_est_reserva")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id_reserva" SERIAL NOT NULL,
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrada" DATE NOT NULL,
    "fecha_salida" DATE NOT NULL,
    "cantidad_personas" INTEGER NOT NULL,
    "observaciones" VARCHAR(300),
    "id_huesped" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "id_est_reserva" INTEGER NOT NULL,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "detalle_reserva" (
    "id_detalle_reserva" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_habitacion" INTEGER NOT NULL,

    CONSTRAINT "detalle_reserva_pkey" PRIMARY KEY ("id_detalle_reserva")
);

-- CreateTable
CREATE TABLE "check_in" (
    "id_checkin" SERIAL NOT NULL,
    "fecha_hora_checkin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_reserva" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,

    CONSTRAINT "check_in_pkey" PRIMARY KEY ("id_checkin")
);

-- CreateTable
CREATE TABLE "check_out" (
    "id_checkout" SERIAL NOT NULL,
    "fecha_hora_checkout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_reserva" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,

    CONSTRAINT "check_out_pkey" PRIMARY KEY ("id_checkout")
);

-- CreateTable
CREATE TABLE "metodo_pago" (
    "id_met_pago" SERIAL NOT NULL,
    "nombre_metodo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),

    CONSTRAINT "metodo_pago_pkey" PRIMARY KEY ("id_met_pago")
);

-- CreateTable
CREATE TABLE "pago" (
    "id_pago" SERIAL NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "id_met_pago" INTEGER NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "factura" (
    "id_factura" SERIAL NOT NULL,
    "numero_factura" VARCHAR(30) NOT NULL,
    "tipo_factura" VARCHAR(30) NOT NULL,
    "rcf" VARCHAR(20),
    "fecha_emision" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_reserva" INTEGER NOT NULL,
    "id_pago" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "itbis" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "detalle_factura" (
    "id_detalle_factura" SERIAL NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "id_thabitacion" INTEGER NOT NULL,
    "cantidad_habitaciones" INTEGER NOT NULL,
    "cantidad_noches" INTEGER NOT NULL,
    "precio_noche" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_factura_pkey" PRIMARY KEY ("id_detalle_factura")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombre_usuario_key" ON "usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "rol_permiso_id_rol_id_permiso_key" ON "rol_permiso"("id_rol", "id_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_cedula_em_key" ON "empleado"("cedula_em");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_correo_em_key" ON "empleado"("correo_em");

-- CreateIndex
CREATE UNIQUE INDEX "huesped_identificacion_hu_key" ON "huesped"("identificacion_hu");

-- CreateIndex
CREATE UNIQUE INDEX "huesped_correo_hu_key" ON "huesped"("correo_hu");

-- CreateIndex
CREATE UNIQUE INDEX "habitacion_numero_habitacion_key" ON "habitacion"("numero_habitacion");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numero_factura_key" ON "factura"("numero_factura");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permiso"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "empleado_id_cargo_fkey" FOREIGN KEY ("id_cargo") REFERENCES "cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitacion" ADD CONSTRAINT "habitacion_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipo_habitacion"("id_thabitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitacion" ADD CONSTRAINT "habitacion_id_est_habitacion_fkey" FOREIGN KEY ("id_est_habitacion") REFERENCES "estado_habitacion"("id_est_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifa" ADD CONSTRAINT "tarifa_id_thabitacion_fkey" FOREIGN KEY ("id_thabitacion") REFERENCES "tipo_habitacion"("id_thabitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_habitacion" ADD CONSTRAINT "historial_habitacion_id_habitacion_fkey" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion"("id_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_habitacion" ADD CONSTRAINT "historial_habitacion_id_est_habitacion_fkey" FOREIGN KEY ("id_est_habitacion") REFERENCES "estado_habitacion"("id_est_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_habitacion" ADD CONSTRAINT "historial_habitacion_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimiento" ADD CONSTRAINT "mantenimiento_id_habitacion_fkey" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion"("id_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimiento" ADD CONSTRAINT "mantenimiento_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_huesped_fkey" FOREIGN KEY ("id_huesped") REFERENCES "huesped"("id_huesped") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_est_reserva_fkey" FOREIGN KEY ("id_est_reserva") REFERENCES "estado_reserva"("id_est_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_reserva" ADD CONSTRAINT "detalle_reserva_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_reserva" ADD CONSTRAINT "detalle_reserva_id_habitacion_fkey" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion"("id_habitacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_out" ADD CONSTRAINT "check_out_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_out" ADD CONSTRAINT "check_out_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_met_pago_fkey" FOREIGN KEY ("id_met_pago") REFERENCES "metodo_pago"("id_met_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "factura"("id_factura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_id_thabitacion_fkey" FOREIGN KEY ("id_thabitacion") REFERENCES "tipo_habitacion"("id_thabitacion") ON DELETE RESTRICT ON UPDATE CASCADE;
