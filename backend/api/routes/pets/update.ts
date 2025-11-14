import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdatePetDTO } from '../../../application/pets/dto/UpdatePetDTO';
import { container } from 'tsyringe';
import { UpdatePetService } from '../../../application/pets/services/UpdatePetService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();
router.put('/:id', validationMiddleware(UpdatePetDTO), async (req, res) => {
  try {
    const service = container.resolve(UpdatePetService);
    const id = Number(req.params.id);
    const pet = await service.execute(id, req.body);
    res.status(200).json(pet);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
