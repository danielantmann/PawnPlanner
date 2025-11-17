import { Router } from 'express';
import { container } from 'tsyringe';
import { DeleteBreedService } from '../../../application/breeds/services/DeleteBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.delete('/:id', async (req, res, next) => {
  try {
    const service = container.resolve(DeleteBreedService);
    await service.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next();
  }
});

export default router;
