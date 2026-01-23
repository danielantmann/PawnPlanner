import { injectable, inject } from 'tsyringe';

import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
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
    @inject('BreedRepository') private breeds: IBreedRepository, // ←🔥 AÑADIDO
    @inject('AppointmentRepository') private appointments: IAppointmentRepository
  ) {}

  async execute(dto: CreateAppointmentDTO, userId: number) {
    // 1. Validar Pet
    const pet = await this.pets.findById(dto.petId, userId);
    if (!pet) throw new NotFoundError(`Pet with id ${dto.petId} not found`);

    // 2. Validar Owner
    const owner = await this.owners.findById(pet.ownerId, userId);
    if (!owner) throw new NotFoundError(`Owner with id ${pet.ownerId} not found`);

    // 3. Validar Breed
    const breed = await this.breeds.findById(pet.breedId, userId);
    if (!breed) throw new NotFoundError(`Breed with id ${pet.breedId} not found`);

    // 4. Validar Service
    const service = await this.services.findById(dto.serviceId, userId);
    if (!service) throw new NotFoundError(`Service with id ${dto.serviceId} not found`);

    // 5. Validar fechas
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    if (start >= end) {
      throw new BadRequestError('startTime must be before endTime');
    }

    // 6. Validar solapamiento
    const overlapping = await this.appointments.findOverlapping(userId, start, end);
    if (overlapping.length > 0) {
      throw new ConflictError('Appointment overlaps with an existing one');
    }

    // 7. Calcular duración
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

    // 8. Precio sugerido
    const estimatedPrice = Number(service.price);

    // 9. Precio final
    const finalPrice = dto.finalPrice !== undefined ? dto.finalPrice : estimatedPrice;

    if (finalPrice < 0) {
      throw new BadRequestError('finalPrice cannot be negative');
    }

    // 10. Crear dominio
    const appointment = new Appointment(
      null,
      userId,
      pet.id!,
      owner.id!,
      service.id!,

      pet.name,
      breed.name,
      owner.name,
      owner.phone,

      service.name,
      estimatedPrice,
      finalPrice,

      start,
      end,
      durationMinutes,

      'completed',
      false
    );

    // 11. Guardar
    const saved = await this.appointments.create(appointment);

    // 12. Devolver DTO
    return AppointmentMapper.toDTO(saved);
  }
}
