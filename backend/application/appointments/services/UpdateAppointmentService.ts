import { injectable, inject } from 'tsyringe';

import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';

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
    @inject('ServiceRepository') private services: IServiceRepository,
    @inject('BreedRepository') private breeds: IBreedRepository
  ) {}

  async execute(id: number, data: any, userId: number) {
    // Convertir strings a números (Express siempre manda strings)
    if (data.petId !== undefined && data.petId !== null) {
      data.petId = Number(data.petId);
    }
    if (data.serviceId !== undefined && data.serviceId !== null) {
      data.serviceId = Number(data.serviceId);
    }

    const existing = await this.appointments.findById(id, userId);
    if (!existing) throw new NotFoundError(`Appointment with id ${id} not found`);

    // Cambia pet → cambia owner, breed, petName, ownerPhone, ownerId
    if (data.petId !== undefined && data.petId !== null && data.petId !== existing.petId) {
      const pet = await this.pets.findById(data.petId, userId);
      if (!pet) throw new NotFoundError(`Pet with id ${data.petId} not found`);

      const owner = await this.owners.findById(pet.ownerId, userId);
      if (!owner) throw new NotFoundError(`Owner with id ${pet.ownerId} not found`);

      const breed = await this.breeds.findById(pet.breedId, userId);
      if (!breed) throw new NotFoundError(`Breed with id ${pet.breedId} not found`);

      existing.petId = pet.id!;
      existing.petName = pet.name;
      existing.breedName = breed.name;

      existing.ownerId = owner.id!;
      existing.ownerName = owner.name;
      existing.ownerPhone = owner.phone;
    }

    // Cambia service
    if (
      data.serviceId !== undefined &&
      data.serviceId !== null &&
      data.serviceId !== existing.serviceId
    ) {
      const service = await this.services.findById(data.serviceId, userId);
      if (!service) throw new NotFoundError(`Service with id ${data.serviceId} not found`);

      existing.serviceId = service.id!;
      existing.serviceName = service.name;
      existing.estimatedPrice = Number(service.price);

      if (data.finalPrice === undefined) {
        existing.finalPrice = existing.estimatedPrice;
      }
    }

    // Cambia fechas
    if (data.startTime || data.endTime) {
      const start = data.startTime ? new Date(data.startTime) : existing.startTime;
      const end = data.endTime ? new Date(data.endTime) : existing.endTime;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError('Invalid date format');
      }

      if (start >= end) {
        throw new BadRequestError('startTime must be before endTime');
      }

      const overlapping = await this.appointments.findOverlapping(userId, start, end);
      const conflict = overlapping.some((a) => a.id !== existing.id);

      if (conflict) throw new ConflictError('Appointment overlaps with an existing one');

      existing.startTime = start;
      existing.endTime = end;
      existing.durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    if (data.finalPrice !== undefined) {
      if (data.finalPrice < 0) throw new BadRequestError('finalPrice cannot be negative');
      existing.finalPrice = data.finalPrice;
    }

    if (data.status) {
      if (!['completed', 'no-show', 'cancelled'].includes(data.status)) {
        throw new BadRequestError('Invalid status');
      }
      existing.status = data.status;
    }

    const saved = await this.appointments.update(existing);
    if (!saved) throw new NotFoundError(`Appointment with id ${id} not found`);

    return AppointmentMapper.toDTO(saved);
  }
}
