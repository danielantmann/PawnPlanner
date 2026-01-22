import { injectable, inject } from 'tsyringe';

import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';

import { AppointmentMapper } from '../mappers/AppointmentMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class UpdateAppointmentService {
  constructor(
    @inject('AppointmentRepository') private appointments: IAppointmentRepository,
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('ServiceRepository') private services: IServiceRepository
  ) {}

  async execute(id: number, data: any, userId: number) {
    // 1. Buscar cita
    const existing = await this.appointments.findById(id, userId);
    if (!existing) throw new NotFoundError(`Appointment with id ${id} not found`);

    // 2. Si cambia petId → validar pet + owner
    if (data.petId && data.petId !== existing.petId) {
      const pet = await this.pets.findById(data.petId, userId);
      if (!pet) throw new NotFoundError(`Pet with id ${data.petId} not found`);

      const owner = await this.owners.findById(pet.ownerId, userId);
      if (!owner) throw new NotFoundError(`Owner with id ${pet.ownerId} not found`);

      existing.petId = pet.id!;
      existing.petName = pet.name;
      existing.ownerName = owner.name;
      existing.ownerPhone = owner.phone;
    }

    // 3. Si cambia serviceId → validar service
    if (data.serviceId && data.serviceId !== existing.serviceId) {
      const service = await this.services.findById(data.serviceId, userId);
      if (!service) throw new NotFoundError(`Service with id ${data.serviceId} not found`);

      existing.serviceId = service.id!;
      existing.serviceName = service.name;
      existing.estimatedPrice = Number(service.price);

      // Si no se toca finalPrice → mantener coherencia
      if (data.finalPrice === undefined) {
        existing.finalPrice = existing.estimatedPrice;
      }
    }

    // 4. Si cambian fechas → validar
    if (data.startTime || data.endTime) {
      const start = data.startTime ? new Date(data.startTime) : existing.startTime;
      const end = data.endTime ? new Date(data.endTime) : existing.endTime;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError('Invalid date format');
      }

      if (start >= end) {
        throw new BadRequestError('startTime must be before endTime');
      }

      // Validar solapamiento
      const overlapping = await this.appointments.findOverlapping(userId, start, end);
      const conflict = overlapping.some((a) => a.id !== existing.id);

      if (conflict) {
        throw new ConflictError('Appointment overlaps with an existing one');
      }

      existing.startTime = start;
      existing.endTime = end;
      existing.durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    // 5. Precio final
    if (data.finalPrice !== undefined) {
      if (data.finalPrice < 0) throw new BadRequestError('finalPrice cannot be negative');
      existing.finalPrice = data.finalPrice;
    }

    // 6. Estado
    if (data.status) {
      if (!['completed', 'no-show', 'cancelled'].includes(data.status)) {
        throw new BadRequestError('Invalid status');
      }
      existing.status = data.status;
    }

    // 7. Guardar
    const saved = await this.appointments.update(existing);

    if (!saved) throw new NotFoundError(`Appointment with id ${id} not found`);

    return AppointmentMapper.toDTO(saved);
  }
}
