import { Router } from 'express';
import { container } from 'tsyringe';
import { DeleteAnimalService } from '../../../application/animals/services/DeleteAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.delete('/:id', async (req, res) => {
  try {
    const service = container.resolve(DeleteAnimalService);
    await service.execute(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
