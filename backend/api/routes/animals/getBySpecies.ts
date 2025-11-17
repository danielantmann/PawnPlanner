import { container } from 'tsyringe';
import { Router } from 'express';
import { GetAnimalBySpeciesService } from '../../../application/animals/services/GetAnimalBySpeciesService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/species/:species', async (req, res, next) => {
  try {
    const service = container.resolve(GetAnimalBySpeciesService);
    const animals = await service.execute(req.params.species);
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
});

export default router;
