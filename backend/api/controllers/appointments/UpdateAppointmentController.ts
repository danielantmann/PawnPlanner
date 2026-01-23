import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UpdateAppointmentService } from '../../../application/appointments/services/UpdateAppointmentService';
import { UpdateAppointmentDTO } from '../../../application/appointments/dto/UpdateAppointmentDTO';

export async function updateAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const dto = req.body as UpdateAppointmentDTO;
    const userId = req.user!.id;

    const service = container.resolve(UpdateAppointmentService);
    const result = await service.execute(id, dto, userId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
