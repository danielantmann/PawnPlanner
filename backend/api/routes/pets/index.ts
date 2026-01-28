import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

import { CreatePetDTO } from '../../../application/pets/dto/CreatePetDTO';
import { UpdatePetDTO } from '../../../application/pets/dto/UpdatePetDTO';

import { createPet } from '../../controllers/pets/create';
import { updatePet } from '../../controllers/pets/update';
import { deletePet } from '../../controllers/pets/delete';
import { getAllPets } from '../../controllers/pets/getAll';
import { getPetById } from '../../controllers/pets/getById';
import { getPetsByName } from '../../controllers/pets/getByName';
import { getPetsByBreed } from '../../controllers/pets/getByBreed';

/**
 * @openapi
 * tags:
 *   - name: Pets
 *     description: Pet management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PetResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         ownerId:
 *           type: integer
 *         ownerName:
 *           type: string
 *         ownerPhone:
 *           type: string
 *         breed:
 *           type: string
 *         importantNotes:
 *           type: string
 *         quickNotes:
 *           type: string
 *
 *     CreatePetDTO:
 *       type: object
 *       required:
 *         - name
 *         - ownerId
 *         - breedId
 *       properties:
 *         name:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         ownerId:
 *           type: integer
 *         breedId:
 *           type: integer
 *         importantNotes:
 *           type: string
 *         quickNotes:
 *           type: string
 *
 *     UpdatePetDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         ownerId:
 *           type: integer
 *         breedId:
 *           type: integer
 *         importantNotes:
 *           type: string
 *         quickNotes:
 *           type: string
 */

/**
 * @openapi
 * /pets:
 *   get:
 *     summary: Get all pets
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PetResponseDTO'
 */

/**
 * @openapi
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags:
 *       - Pets
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
 *         description: Pet found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponseDTO'
 *       404:
 *         description: Pet not found
 */

/**
 * @openapi
 * /pets/name/{name}:
 *   get:
 *     summary: Search pets by partial name
 *     tags:
 *       - Pets
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
 *         description: Matching pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PetResponseDTO'
 */

/**
 * @openapi
 * /pets/breed/{breedId}:
 *   get:
 *     summary: Get pets by breed
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: breedId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pets of the given breed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PetResponseDTO'
 */

/**
 * @openapi
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePetDTO'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags:
 *       - Pets
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
 *             $ref: '#/components/schemas/UpdatePetDTO'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponseDTO'
 *       404:
 *         description: Pet not found
 */

/**
 * @openapi
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     tags:
 *       - Pets
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
 *         description: Pet deleted successfully
 *       404:
 *         description: Pet not found
 */

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authMiddleware);

router.post('/', validationMiddleware(CreatePetDTO), createPet);
router.put('/:id', validationMiddleware(UpdatePetDTO), updatePet);
router.delete('/:id', deletePet);
router.get('/name/:name', getPetsByName);
router.get('/breed/:breedId', getPetsByBreed);
router.get('/:id', getPetById);
router.get('/', getAllPets);

export default router;
