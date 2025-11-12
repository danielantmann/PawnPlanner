import { Router } from 'express';
import { container } from 'tsyringe';
import { GetPetByIdService } from '../../../application/pets/services/GetPetByIdService';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const service = container.resolve(GetPetByIdService);
    const pet = await service.execute(Number(req.params.id));

    if (!pet) return res.status(404).json({ error: 'Pet not found ' });

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
