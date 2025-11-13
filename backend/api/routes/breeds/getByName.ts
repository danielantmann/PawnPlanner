import { Router } from 'express';
import { container } from 'tsyringe';
import { GetBreedByNameService } from '../../../application/breeds/services/GetBreedByNameService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/name/:name', async (req, res) => {
  try {
    const service = container.resolve(GetBreedByNameService);
    const breeds = await service.execute(req.params.name);
    res.status(200).json(breeds);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
