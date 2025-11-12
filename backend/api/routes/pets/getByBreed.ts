import { Router } from 'express';
import { container } from 'tsyringe';
import { GetPetByBreedService } from '../../../application/pets/services/GetPetByBreedService';

const router = Router();

router.get('/breed/:breedId', async (req, res) => {
  try {
    const service = container.resolve(GetPetByBreedService);
    const pets = await service.execute(Number(req.params.breedId));

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
export default router;
