import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdatePetDTO } from '../../../application/pets/dto/UpdatePetDto';
import { container } from 'tsyringe';
import { UpdatePetService } from '../../../application/pets/services/UpdatePetService';

const router = Router();

router.put('/:id', validationMiddleware(UpdatePetDTO), async (req, res) => {
  try {
    const service = container.resolve(UpdatePetService);
    const dto = { ...req.body, id: Number(req.params.id) };
    const pet = await service.execute(dto);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
