import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DeleteAppointmentService } from '../../../application/appointments/services/DeleteAppointmentService';

export async function deleteAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const service = container.resolve(DeleteAppointmentService);
    await service.execute(id, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
