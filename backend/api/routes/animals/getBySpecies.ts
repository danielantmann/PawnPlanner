import { container } from 'tsyringe';
import { Router } from 'express';
import { GetAnimalBySpeciesService } from '../../../application/animals/services/GetAnimalBySpeciesService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/species/:species', async (req, res) => {
  try {
    const service = container.resolve(GetAnimalBySpeciesService);
    const animals = await service.execute(req.params.species);
    res.status(200).json(animals);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
