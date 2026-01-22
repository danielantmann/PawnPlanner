import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

import { CreateAppointmentDTO } from '../../../application/appointments/dto/CreateAppointmentDTO';
import { UpdateAppointmentDTO } from '../../../application/appointments/dto/UpdateAppointmentDTO';

import { createAppointment } from '../../controllers/appointments/CreateAppointmentController';
import { updateAppointment } from '../../controllers/appointments/UpdateAppointmentController';
import { deleteAppointment } from '../../controllers/appointments/DeleteAppointmentController';
import { getAppointmentsByRange } from '../../controllers/appointments/GetAppointmentsByRangeController';
import { getCompletedAppointmentsByRange } from '../../controllers/appointments/GetCompletedAppointmentsInRangeController';

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authMiddleware);

// POST /appointments - Crear cita
router.post('/', validationMiddleware(CreateAppointmentDTO), createAppointment);

// PUT /appointments/:id - Actualizar cita
router.put('/:id', validationMiddleware(UpdateAppointmentDTO, true), updateAppointment);

// DELETE /appointments/:id - Eliminar cita
router.delete('/:id', deleteAppointment);

// GET /appointments?start=...&end=... - Obtener citas en rango de fechas
router.get('/', getAppointmentsByRange);

// GET /appointments/completed?start=...&end=... - Obtener citas completadas en rango
router.get('/completed', getCompletedAppointmentsByRange);

export default router;
