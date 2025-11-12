import { DeletePetService } from './../../../application/pets/services/DeletePetService';
import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { container } from 'tsyringe';

const router = Router();

router.delete('/:id', async (req, res) => {
  try {
    const service = container.resolve(DeletePetService);
    const ok = await service.execute(Number(req.params.id));

    if (!ok) return res.status(404).json({ error: 'Pet not found' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
export default router;
