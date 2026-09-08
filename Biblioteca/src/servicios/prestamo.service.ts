// =====================================================================
//  CHECKPOINT 4  —  el Service: aqui y SOLO aqui viven las reglas
// =====================================================================
//  Regla de negocio de esta practica:
//    "no se puede prestar un ejemplar que ya esta prestado"
//
//  TODO 4:
//    1. Recibir el repositorio POR CONSTRUCTOR, tipado con la
//       INTERFAZ `PrestamoRepository`, nunca con la clase concreta.
//    2. Metodo `crear(dto: CrearPrestamoDto): Promise<Prestamo>`:
//         a. pedir al repositorio los prestamos de ese libro
//         b. juntar los ejemplares que ya estan fuera
//            (pista: `.filter(...)` por estado + `.flatMap(...)`)
//         c. si alguno de los solicitados choca, lanzar
//            `new EjemplarPrestadoError(numero)`
//         d. si no, guardar el prestamo nuevo y devolverlo
//    3. Metodo `listarPorLibro(libroId)` que solo delega al repositorio.
//
//  LA PRUEBA DE FUEGO de este archivo:
//    ¿aparece la palabra `InMemory` en algun import? Si aparece, el
//    Service quedo acoplado a la infraestructura y el patron se rompio.
// =====================================================================

import { PrestamoRepository } from "../dominio/prestamo.repository.js";
import { Prestamo, nuevoFolio } from "../dominio/prestamo.entity.js";
import { CrearPrestamoDTO } from "../dto/crear-prestamo.dto.js";
import { EjemplarPrestadoError } from "../errores/ejemplar-prestado.error.js";

export class PrestamoService {
    constructor(private readonly repositorio: PrestamoRepository) {}

    async crear(dto: CrearPrestamoDTO): Promise<Prestamo> {
        const prestamosDelLibro = await this.repositorio.findByLibro(dto.libroId);

        const prestamosActivos = prestamosDelLibro.filter(p => p.estado !== 'devuelto');

        const ejemplaresFuera = new Set<number>();
        prestamosActivos.forEach(p => {
            p.ejemplares.forEach(e => ejemplaresFuera.add(e));
        });

        for (const ejemplar of dto.ejemplares) {
            if (ejemplaresFuera.has(ejemplar)) {
                throw new EjemplarPrestadoError(ejemplar);
            }
        }

        const nuevoPrestamo: Prestamo = {
            ...dto,
            folio: nuevoFolio(),
            creadoEn: new Date(),
            estado: 'activo',
            costoReposicion: 0
        };

        return this.repositorio.save(nuevoPrestamo);
    }

    async listarPorLibro(libroId: string): Promise<Prestamo[]> {
        return this.repositorio.findByLibro(libroId);
    }
}
