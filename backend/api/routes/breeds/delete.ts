import { Router } from 'express';
import { container } from 'tsyringe';
import { DeleteBreedService } from '../../../application/breeds/services/DeleteBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.delete('/:id', async (req, res) => {
  try {
    const service = container.resolve(DeleteBreedService);
    await service.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
