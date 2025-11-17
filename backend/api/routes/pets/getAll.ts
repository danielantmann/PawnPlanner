import { Router } from 'express';
import { container } from 'tsyringe';
import { GetAllPetsService } from '../../../application/pets/services/GetAllPetsService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const service = container.resolve(GetAllPetsService);
    const pets = await service.execute();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
