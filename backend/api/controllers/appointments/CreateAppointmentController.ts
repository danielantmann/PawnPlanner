import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateAppointmentService } from '../../../application/appointments/services/CreateAppointmentService';
import { CreateAppointmentDTO } from '../../../application/appointments/dto/CreateAppointmentDTO';

export async function createAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreateAppointmentDTO;
    const userId = req.user!.id;

    const service = container.resolve(CreateAppointmentService);
    const result = await service.execute(dto, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
