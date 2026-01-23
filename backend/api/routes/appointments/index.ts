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

router.post('/', validationMiddleware(CreateAppointmentDTO), createAppointment);
router.put('/:id', validationMiddleware(UpdateAppointmentDTO, true), updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/', getAppointmentsByRange);
router.get('/completed', getCompletedAppointmentsByRange);

export default router;
