import type { EstadoPrestamo, Prestamo } from '../src/dominio/prestamo.entity.js';

export type PrestamoResponseDto = {
  folio: string;
  creadoEn: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
};

export type CrearPrestamoRequestDto = {
  libroId: string;
  ejemplares: number[];
  socioId: string;
};

export type ErrorResponseDto = {
  error: string;
  errores?: string[];
};

export function aResponseDto(prestamo: Prestamo): PrestamoResponseDto {
  return {
    folio: prestamo.folio,
    creadoEn: prestamo.creadoEn.toISOString(),
    libroId: prestamo.libroId,
    ejemplares: prestamo.ejemplares,
    socioId: prestamo.socioId,
    estado: prestamo.estado,
  };
}
