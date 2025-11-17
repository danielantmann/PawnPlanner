import { Router } from 'express';
import { container } from 'tsyringe';
import { DeleteAnimalService } from '../../../application/animals/services/DeleteAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.delete('/:id', async (req, res, next) => {
  try {
    const service = container.resolve(DeleteAnimalService);
    await service.execute(Number(req.params.id));
    res.status(200).json({
      deleted: true,
      message: `Animal ${req.params.id} deleted`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
