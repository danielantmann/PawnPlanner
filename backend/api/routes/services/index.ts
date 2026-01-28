import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

import { CreateServiceDTO } from '../../../application/services/dto/CreateServiceDTO';
import { UpdateServiceDTO } from '../../../application/services/dto/UpdateServiceDTO';

import { createServiceController } from '../../controllers/services/createServiceController';
import { updateServiceController } from '../../controllers/services/updateServiceController';
import { deleteServiceController } from '../../controllers/services/deleteServiceController';
import { getAllServicesController } from '../../controllers/services/getAllServicesController';
import { getServiceByIdController } from '../../controllers/services/getServiceByIdController';

/**
 * @openapi
 * tags:
 *   - name: Services
 *     description: Service management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         userId:
 *           type: integer
 *
 *     CreateServiceDTO:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *
 *     UpdateServiceDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 */

/**
 * @openapi
 * /services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceResponse'
 */

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags:
 *       - Services
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
 *         description: Service found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       404:
 *         description: Service not found
 */

/**
 * @openapi
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceDTO'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags:
 *       - Services
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
 *             $ref: '#/components/schemas/UpdateServiceDTO'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       404:
 *         description: Service not found
 */

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags:
 *       - Services
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
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */

const router = Router();

// 🔐 Protege TODAS las rutas de Services
router.use(authMiddleware);

router.post('/', validationMiddleware(CreateServiceDTO), createServiceController);
router.put('/:id', validationMiddleware(UpdateServiceDTO), updateServiceController);
router.delete('/:id', deleteServiceController);
router.get('/', getAllServicesController);
router.get('/:id', getServiceByIdController);

export default router;
