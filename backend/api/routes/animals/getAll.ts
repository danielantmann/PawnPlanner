import { Router } from 'express';
import { container } from 'tsyringe';
import { GetAllAnimalsService } from '../../../application/animals/services/GetAllAnimalsService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const service = container.resolve(GetAllAnimalsService);
    const animals = await service.execute();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
