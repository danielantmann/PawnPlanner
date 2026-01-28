import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

import { CreateOwnerDTO } from '../../../application/owners/dto/CreateOwnerDTO';
import { UpdateOwnerDTO } from '../../../application/owners/dto/UpdateOwnerDTO';

import { createOwner } from '../../controllers/owners/create';
import { updateOwner } from '../../controllers/owners/update';
import { deleteOwner } from '../../controllers/owners/delete';
import { getAllOwners } from '../../controllers/owners/getAll';
import { getOwnerById } from '../../controllers/owners/getById';
import { getOwnerByEmail } from '../../controllers/owners/getByEmail';
import { getOwnerByName } from '../../controllers/owners/getByName';

/**
 * @openapi
 * tags:
 *   - name: Owners
 *     description: Owner management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     OwnerPetSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *
 *     OwnerResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         pets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OwnerPetSummary'
 *
 *     OwnerWithPetsResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         pets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OwnerPetSummary'
 *
 *     CreateOwnerDTO:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         phone:
 *           type: string
 *           example: "+34600111222"
 *         email:
 *           type: string
 *           format: email
 *
 *     UpdateOwnerDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 */

/**
 * @openapi
 * /owners:
 *   get:
 *     summary: Get all owners
 *     tags:
 *       - Owners
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OwnerResponseDTO'
 */

/**
 * @openapi
 * /owners/{id}:
 *   get:
 *     summary: Get owner by ID
 *     tags:
 *       - Owners
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
 *         description: Owner found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnerWithPetsResponseDTO'
 *       404:
 *         description: Owner not found
 */

/**
 * @openapi
 * /owners/name/{name}:
 *   get:
 *     summary: Search owners by partial name
 *     tags:
 *       - Owners
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching owners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OwnerResponseDTO'
 */

/**
 * @openapi
 * /owners/email/{email}:
 *   get:
 *     summary: Get owner by email
 *     tags:
 *       - Owners
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Owner found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnerWithPetsResponseDTO'
 *       404:
 *         description: Owner not found
 */

/**
 * @openapi
 * /owners:
 *   post:
 *     summary: Create a new owner
 *     tags:
 *       - Owners
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOwnerDTO'
 *     responses:
 *       201:
 *         description: Owner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnerResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /owners/{id}:
 *   put:
 *     summary: Update an owner
 *     tags:
 *       - Owners
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
 *             $ref: '#/components/schemas/UpdateOwnerDTO'
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnerResponseDTO'
 *       404:
 *         description: Owner not found
 */

/**
 * @openapi
 * /owners/{id}:
 *   delete:
 *     summary: Delete an owner
 *     tags:
 *       - Owners
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
 *         description: Owner deleted successfully
 *       404:
 *         description: Owner not found
 */

const router = Router();

router.use(authMiddleware);

router.post('/', validationMiddleware(CreateOwnerDTO), createOwner);
router.put('/:id', validationMiddleware(UpdateOwnerDTO), updateOwner);
router.delete('/:id', deleteOwner);

router.get('/', getAllOwners);
router.get('/:id', getOwnerById);
router.get('/email/:email', getOwnerByEmail);
router.get('/name/:name', getOwnerByName);

export default router;
