import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateWorkerDTO } from '../../../application/workers/dto/CreateWorkerDTO';
import { UpdateWorkerDTO } from '../../../application/workers/dto/UpdateWorkerDTO';

import { createWorkerController } from '../../controllers/workers/createWorkerController';
import { updateWorkerController } from '../../controllers/workers/updateWorkerController';
import { deleteWorkerController } from '../../controllers/workers/deleteWorkerController';
import { getAllWorkersController } from '../../controllers/workers/getAllWorkersController';
import { getWorkerByIdController } from '../../controllers/workers/getWorkerByIdController';

/**
 * @openapi
 * tags:
 *   - name: Workers
 *     description: Worker management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     WorkerResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *
 *     CreateWorkerDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         phone:
 *           type: string
 *           nullable: true
 *
 *     UpdateWorkerDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         phone:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 */

/**
 * @openapi
 * /workers:
 *   get:
 *     summary: Get all workers
 *     tags:
 *       - Workers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all workers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkerResponseDTO'
 */

/**
 * @openapi
 * /workers:
 *   post:
 *     summary: Create a new worker
 *     tags:
 *       - Workers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkerDTO'
 *     responses:
 *       201:
 *         description: Worker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags:
 *       - Workers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Worker found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponseDTO'
 *       404:
 *         description: Worker not found
 */

/**
 * @openapi
 * /workers/{id}:
 *   put:
 *     summary: Update a worker
 *     tags:
 *       - Workers
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
 *             $ref: '#/components/schemas/UpdateWorkerDTO'
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponseDTO'
 *       404:
 *         description: Worker not found
 */

/**
 * @openapi
 * /workers/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags:
 *       - Workers
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
 *         description: Worker deleted successfully
 *       404:
 *         description: Worker not found
 */

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authMiddleware);

router.post('/', validationMiddleware(CreateWorkerDTO), createWorkerController);
router.put('/:id', validationMiddleware(UpdateWorkerDTO), updateWorkerController);
router.delete('/:id', deleteWorkerController);
router.get('/:id', getWorkerByIdController);
router.get('/', getAllWorkersController);

export default router;
