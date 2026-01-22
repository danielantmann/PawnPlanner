import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

import { CreateServiceDTO } from '../../../application/services/dto/CreateServiceDTO';
import { UpdateServiceDTO } from '../../../application/services/dto/UpdateServiceDTO';

import { createServiceController } from '../../controllers/services/createServiceController';
import { updateServiceController } from '../../controllers/services/updateServiceController';
import { deleteServiceController } from '../../controllers/services/deleteServiceController';
import { getAllServicesController } from '../../controllers/services/getAllServicesController';
import { getServiceByIdController } from '../../controllers/services/getServiceByIdController';

const router = Router();

// 🔐 Protege TODAS las rutas de Services
router.use(authMiddleware);

router.post('/', validationMiddleware(CreateServiceDTO), createServiceController);
router.put('/:id', validationMiddleware(UpdateServiceDTO), updateServiceController);
router.delete('/:id', deleteServiceController);
router.get('/', getAllServicesController);
router.get('/:id', getServiceByIdController);

export default router;
