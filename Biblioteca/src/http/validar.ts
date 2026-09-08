import type { ErrorRequestHandler } from 'express';

import type { CrearPrestamoRequestDto, ErrorResponseDto } from '../../contratos/prestamo.dto.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

export class ErrorValidacion extends Error {
  constructor(public readonly errores: string[]) {
    super('La petición no es válida');
    this.name = 'ErrorValidacion';
  }
}

/** Valida datos externos antes de convertirlos al DTO de creación. */
export function validarCrearPrestamo(dato: unknown): CrearPrestamoRequestDto {
  const errores: string[] = [];
  const cuerpo = esRegistro(dato) ? dato : null;

  if (cuerpo === null) {
    throw new ErrorValidacion(['El cuerpo debe ser un objeto JSON.']);
  }

  const libroId = cuerpo.libroId;
  const socioId = cuerpo.socioId;
  const ejemplares = cuerpo.ejemplares;
  const ejemplaresValidos: number[] = [];

  if (typeof libroId !== 'string' || libroId.trim() === '') {
    errores.push('libroId es obligatorio y debe ser texto.');
  }
  if (typeof socioId !== 'string' || socioId.trim() === '') {
    errores.push('socioId es obligatorio y debe ser texto.');
  }
  if (!Array.isArray(ejemplares) || ejemplares.length === 0) {
    errores.push('ejemplares debe contener al menos un ejemplar.');
  } else {
    ejemplares.forEach((ejemplar, indice) => {
      if (typeof ejemplar !== 'number' || !Number.isInteger(ejemplar) || ejemplar <= 0) {
        errores.push(`ejemplares[${indice}] debe ser un entero positivo.`);
      } else {
        ejemplaresValidos.push(ejemplar);
      }
    });
  }

  if (errores.length > 0) {
    throw new ErrorValidacion(errores);
  }

  return {
    libroId: (libroId as string).trim(),
    socioId: (socioId as string).trim(),
    ejemplares: ejemplaresValidos,
  };
}

/** Traduce errores de la aplicación a respuestas HTTP públicas. */
export const manejadorDeErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ErrorValidacion) {
    const respuesta: ErrorResponseDto = { error: error.message, errores: error.errores };
    res.status(400).json(respuesta);
    return;
  }

  if (error instanceof EjemplarPrestadoError) {
    const respuesta: ErrorResponseDto = { error: error.message };
    res.status(409).json(respuesta);
    return;
  }

  const respuesta: ErrorResponseDto = { error: 'Error interno del servidor.' };
  res.status(500).json(respuesta);
};

function esRegistro(dato: unknown): dato is Record<string, unknown> {
  return typeof dato === 'object' && dato !== null && !Array.isArray(dato);
}
