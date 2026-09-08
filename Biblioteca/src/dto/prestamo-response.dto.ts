//  Este es lo que el sistema DEVUELVE. Fijense en lo que NO lleva:
//  `costoReposicion` se queda dentro. Ese es el punto del patron.
//
//  TODO:
//    1. Declarar PrestamoResponseDto con: folio, libroId, ejemplares,
//       socioId, estado y creadoEn como string (formato ISO).
//    2. Escribir la funcion `aResponseDto(p: Prestamo)` que convierte
//       la entidad en el DTO.


import type { Prestamo, EstadoPrestamo } from '../dominio/prestamo.entity.js';

export interface PrestamoResponseDto {
  // TODO 3b.1: declarar los campos publicos
}

export function aResponseDto(p: Prestamo): PrestamoResponseDto {
  // TODO 3b.2: construir y devolver el DTO
  throw new Error('TODO 3b.2');
}
