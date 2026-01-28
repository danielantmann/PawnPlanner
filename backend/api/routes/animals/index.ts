import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateAnimalDTO } from '../../../application/animals/dto/CreateAnimalDTO';
import { UpdateAnimalDTO } from '../../../application/animals/dto/UpdateAnimalDTO';

import { createAnimal } from '../../controllers/animals/create';
import { updateAnimal } from '../../controllers/animals/update';
import { deleteAnimal } from '../../controllers/animals/delete';
import { getAllAnimals } from '../../controllers/animals/getAll';
import { getAnimalById } from '../../controllers/animals/getById';
import { getAnimalsBySpecies } from '../../controllers/animals/getBySpecies';

/**
 * @openapi
 * tags:
 *   - name: Animals
 *     description: Animal management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AnimalResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         species:
 *           type: string
 *         userId:
 *           type: integer
 *           nullable: true
 *
 *     CreateAnimalDTO:
 *       type: object
 *       required:
 *         - species
 *       properties:
 *         species:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *
 *     UpdateAnimalDTO:
 *       type: object
 *       required:
 *         - species
 *       properties:
 *         species:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 */

/**
 * @openapi
 * /animals:
 *   get:
 *     summary: Get all animals
 *     tags:
 *       - Animals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnimalResponseDTO'
 */

/**
 * @openapi
 * /animals/{id}:
 *   get:
 *     summary: Get animal by ID
 *     tags:
 *       - Animals
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
 *         description: Animal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponseDTO'
 *       404:
 *         description: Animal not found
 */

/**
 * @openapi
 * /animals/species/{species}:
 *   get:
 *     summary: Get animals by species
 *     tags:
 *       - Animals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: species
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Animals matching the species
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnimalResponseDTO'
 */

/**
 * @openapi
 * /animals:
 *   post:
 *     summary: Create a new animal
 *     tags:
 *       - Animals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnimalDTO'
 *     responses:
 *       201:
 *         description: Animal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /animals/{id}:
 *   put:
 *     summary: Update an animal
 *     tags:
 *       - Animals
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
 *             $ref: '#/components/schemas/UpdateAnimalDTO'
 *     responses:
 *       200:
 *         description: Animal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalResponseDTO'
 *       404:
 *         description: Animal not found
 */

/**
 * @openapi
 * /animals/{id}:
 *   delete:
 *     summary: Delete an animal
 *     tags:
 *       - Animals
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
 *         description: Animal deleted successfully
 *       404:
 *         description: Animal not found
 */

const router = Router();

router.use(authMiddleware);

router.post('/', validationMiddleware(CreateAnimalDTO), createAnimal);
router.put('/:id', validationMiddleware(UpdateAnimalDTO), updateAnimal);
router.delete('/:id', deleteAnimal);

router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);
router.get('/species/:species', getAnimalsBySpecies);

export default router;
