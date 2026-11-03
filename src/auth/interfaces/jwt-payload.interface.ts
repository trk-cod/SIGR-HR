export interface JwtPayload {
  sub: number;
  usuario: string;
  rol: string;
  permisos: string[];
}