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

/**
 * @openapi
 * tags:
 *   - name: Appointments
 *     description: Appointment scheduling and management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AppointmentResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         petId:
 *           type: integer
 *         petName:
 *           type: string
 *         ownerName:
 *           type: string
 *         ownerPhone:
 *           type: string
 *         serviceId:
 *           type: integer
 *         serviceName:
 *           type: string
 *         estimatedPrice:
 *           type: number
 *         finalPrice:
 *           type: number
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         durationMinutes:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, completed, no-show, cancelled]
 *
 *     CreateAppointmentDTO:
 *       type: object
 *       required:
 *         - petId
 *         - serviceId
 *         - startTime
 *         - endTime
 *       properties:
 *         petId:
 *           type: integer
 *         serviceId:
 *           type: integer
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         finalPrice:
 *           type: number
 *           nullable: true
 *
 *     UpdateAppointmentDTO:
 *       type: object
 *       properties:
 *         petId:
 *           type: integer
 *         serviceId:
 *           type: integer
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         finalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [completed, no-show, cancelled]
 */

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Get appointments within a date range
 *     description: Returns all appointments whose startTime falls between the given start and end dates.
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Appointments in the given range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponseDTO'
 */

/**
 * @openapi
 * /appointments/completed:
 *   get:
 *     summary: Get completed appointments within a date range
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Completed appointments in the given range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponseDTO'
 */

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentDTO'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointmentDTO'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponseDTO'
 *       404:
 *         description: Appointment not found
 */

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authMiddleware);

router.post('/', validationMiddleware(CreateAppointmentDTO), createAppointment);
router.put('/:id', validationMiddleware(UpdateAppointmentDTO, true), updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/', getAppointmentsByRange);
router.get('/completed', getCompletedAppointmentsByRange);

export default router;
