import express from 'express';

import { aResponseDto } from '../../contratos/prestamo.dto.js';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { PrestamoService } from '../servicios/prestamo.service.js';
import { manejadorDeErrores, validarCrearPrestamo } from './validar.js';

const app = express();
const servicio = new PrestamoService(new InMemoryPrestamoRepository());
const puerto = 3000;

app.use(express.json());
app.use(express.static('publico'));
app.use(express.static('dist/publico'));

app.get('/api/prestamos', async (req, res, next) => {
  try {
    const libroId = req.query.libroId;
    if (typeof libroId !== 'string' || libroId.trim() === '') {
      res.status(400).json({ error: 'libroId es obligatorio.' });
      return;
    }

    const prestamos = await servicio.listarPorLibro(libroId.trim());
    res.status(200).json(prestamos.map(aResponseDto));
  } catch (error) {
    next(error);
  }
});

app.post('/api/prestamos', async (req, res, next) => {
  try {
    const solicitud = validarCrearPrestamo(req.body);
    const prestamo = await servicio.crear(solicitud);
    res
      .location(`/api/prestamos/${prestamo.folio}`)
      .status(201)
      .json(aResponseDto(prestamo));
  } catch (error) {
    next(error);
  }
});

app.use(manejadorDeErrores);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
