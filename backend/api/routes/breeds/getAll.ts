import { Router } from 'express';
import { container } from 'tsyringe';
import { GetAllBreedsService } from '../../../application/breeds/services/GetAllBreedsService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const service = container.resolve(GetAllBreedsService);
    const breeds = await service.execute();
    res.status(200).json(breeds);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
