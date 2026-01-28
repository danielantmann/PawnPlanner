// api/routes/users/index.ts
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { getMyProfile } from '../../controllers/users/getMyProfile';
import { updateMyProfile } from '../../controllers/users/updateMyProfile';
import { deleteMyAccount } from '../../controllers/users/deleteMyAccount';
import { UpdateUserDTO } from '../../../application/users/dto/UpdateUserDTO';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User profile management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         secondLastName:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get my profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 */

/**
 * @openapi
 * /users/me:
 *   put:
 *     summary: Update my profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: Delete my account
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deleted successfully
 */

const router = Router();

router.use(authMiddleware);

router.get('/me', getMyProfile);
router.put('/me', validationMiddleware(UpdateUserDTO), updateMyProfile);
router.delete('/me', deleteMyAccount);

export default router;
