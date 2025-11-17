import { Router } from 'express';
import { container } from 'tsyringe';
import { DeleteOwnerService } from '../../../application/owners/services/DeleteOwnerService';

const router = Router();

router.delete('/:id', async (req, res, next) => {
  try {
    const service = container.resolve(DeleteOwnerService);
    await service.execute(Number(req.params.id));
    res.status(200).json({
      deleted: true,
      message: `Owner ${req.params.id} deleted`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
