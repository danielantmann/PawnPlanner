import { Router } from 'express';
import { container } from 'tsyringe';
import { GetBreedsByAnimalService } from '../../../application/breeds/services/GetBreedsByAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/animal/:animalId', async (req, res) => {
  try {
    const service = container.resolve(GetBreedsByAnimalService);
    const breeds = await service.execute(Number(req.params.animalId));
    res.status(200).json(breeds);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
