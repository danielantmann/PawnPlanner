import { CreatePetService } from './../../../application/pets/services/CreatePetService';
import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreatePetDTO } from '../../../application/pets/dto/CreatePetDTO';
import { container } from 'tsyringe';

const router = Router();
router.post('/', validationMiddleware(CreatePetDTO), async (req, res) => {
  try {
    const service = container.resolve(CreatePetService);
    const pet = await service.execute(req.body);
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
