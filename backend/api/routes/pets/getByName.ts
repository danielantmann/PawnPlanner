import { Router } from 'express';
import { container } from 'tsyringe';
import { GetPetByNameService } from '../../../application/pets/services/GetPetByNameService';

const router = Router();

router.get('/name/:name', async (req, res) => {
  try {
    const service = container.resolve(GetPetByNameService);
    const pets = await service.execute(req.params.name);

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
