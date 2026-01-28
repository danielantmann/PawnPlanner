import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateBreedDTO } from '../../../application/breeds/dto/CreateBreedDTO';
import { UpdateBreedDTO } from '../../../application/breeds/dto/UpdateBreedDTO';

import { createBreed } from '../../controllers/breeds/create';
import { updateBreed } from '../../controllers/breeds/update';
import { deleteBreed } from '../../controllers/breeds/delete';
import { getAllBreeds } from '../../controllers/breeds/getAll';
import { getBreedById } from '../../controllers/breeds/getById';
import { getBreedByName } from '../../controllers/breeds/getByName';
import { getBreedsByAnimal } from '../../controllers/breeds/getByAnimal';

/**
 * @openapi
 * tags:
 *   - name: Breeds
 *     description: Breed management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     BreedAnimalSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         species:
 *           type: string
 *
 *     BreedResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         animal:
 *           $ref: '#/components/schemas/BreedAnimalSummary'
 *
 *     CreateBreedDTO:
 *       type: object
 *       required:
 *         - name
 *         - animalId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 80
 *         animalId:
 *           type: integer
 *           example: 1
 *
 *     UpdateBreedDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 80
 *         animalId:
 *           type: integer
 *           nullable: true
 */

/**
 * @openapi
 * /breeds:
 *   get:
 *     summary: Get all breeds
 *     tags:
 *       - Breeds
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of breeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BreedResponseDTO'
 */

/**
 * @openapi
 * /breeds/{id}:
 *   get:
 *     summary: Get breed by ID
 *     tags:
 *       - Breeds
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
 *         description: Breed found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BreedResponseDTO'
 *       404:
 *         description: Breed not found
 */

/**
 * @openapi
 * /breeds/name/{name}:
 *   get:
 *     summary: Search breeds by partial name
 *     tags:
 *       - Breeds
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
 *         description: Matching breeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BreedResponseDTO'
 */

/**
 * @openapi
 * /breeds/animal/{animalId}:
 *   get:
 *     summary: Get breeds by animal ID
 *     tags:
 *       - Breeds
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Breeds for the given animal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BreedResponseDTO'
 */

/**
 * @openapi
 * /breeds:
 *   post:
 *     summary: Create a new breed
 *     tags:
 *       - Breeds
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBreedDTO'
 *     responses:
 *       201:
 *         description: Breed created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BreedResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /breeds/{id}:
 *   put:
 *     summary: Update a breed
 *     tags:
 *       - Breeds
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
 *             $ref: '#/components/schemas/UpdateBreedDTO'
 *     responses:
 *       200:
 *         description: Breed updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BreedResponseDTO'
 *       404:
 *         description: Breed not found
 */

/**
 * @openapi
 * /breeds/{id}:
 *   delete:
 *     summary: Delete a breed
 *     tags:
 *       - Breeds
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
 *         description: Breed deleted successfully
 *       404:
 *         description: Breed not found
 */

const router = Router();

router.use(authMiddleware);

router.post('/', validationMiddleware(CreateBreedDTO), createBreed);
router.put('/:id', validationMiddleware(UpdateBreedDTO), updateBreed);
router.delete('/:id', deleteBreed);

router.get('/', getAllBreeds);
router.get('/:id', getBreedById);
router.get('/name/:name', getBreedByName);
router.get('/animal/:animalId', getBreedsByAnimal);

export default router;
