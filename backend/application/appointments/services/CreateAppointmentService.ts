import { injectable, inject } from 'tsyringe';

import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';

import { CreateAppointmentDTO } from '../dto/CreateAppointmentDTO';
import { AppointmentMapper } from '../mappers/AppointmentMapper';
import { Appointment } from '../../../core/appointments/domain/Appointment';

import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('ServiceRepository') private services: IServiceRepository,
    @inject('AppointmentRepository') private appointments: IAppointmentRepository
  ) {}

  async execute(dto: CreateAppointmentDTO, userId: number) {
    // 1. Validar Pet
    const pet = await this.pets.findById(dto.petId, userId);
    if (!pet) throw new NotFoundError(`Pet with id ${dto.petId} not found`);

    // 2. Validar Owner (viene del pet)
    const owner = await this.owners.findById(pet.ownerId, userId);
    if (!owner) throw new NotFoundError(`Owner with id ${pet.ownerId} not found`);

    // 3. Validar Service
    const service = await this.services.findById(dto.serviceId, userId);
    if (!service) throw new NotFoundError(`Service with id ${dto.serviceId} not found`);

    // 4. Validar fechas
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    if (start >= end) {
      throw new BadRequestError('startTime must be before endTime');
    }

    // 5. Validar solapamiento
    const overlapping = await this.appointments.findOverlapping(userId, start, end);
    if (overlapping.length > 0) {
      throw new ConflictError('Appointment overlaps with an existing one');
    }

    // 6. Calcular duración
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

    // 7. Precio sugerido
    const estimatedPrice = Number(service.price);

    // 8. Precio final (si no se toca → estimatedPrice)
    const finalPrice = dto.finalPrice !== undefined ? dto.finalPrice : estimatedPrice;

    if (finalPrice < 0) {
      throw new BadRequestError('finalPrice cannot be negative');
    }

    // 9. Crear dominio
    const appointment = new Appointment(
      null,
      userId,
      pet.id!,
      service.id!,

      pet.name,
      owner.name,
      owner.phone,

      service.name,
      estimatedPrice,
      finalPrice,

      start,
      end,
      durationMinutes,

      'completed', // por defecto
      false
    );

    // 10. Guardar
    const saved = await this.appointments.create(appointment);

    // 11. Devolver DTO
    return AppointmentMapper.toDTO(saved);
  }
}
