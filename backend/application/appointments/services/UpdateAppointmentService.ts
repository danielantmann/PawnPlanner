import { injectable, inject } from 'tsyringe';

import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';

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
    @inject('BreedRepository') private breeds: IBreedRepository,
    @inject('WorkerRepository') private workers: IWorkerRepository
  ) {}

  async execute(id: number, data: any, userId: number) {
    if (data.petId !== undefined && data.petId !== null) {
      data.petId = Number(data.petId);
    }
    if (data.serviceId !== undefined && data.serviceId !== null) {
      data.serviceId = Number(data.serviceId);
    }
    if (data.workerId !== undefined && data.workerId !== null) {
      data.workerId = Number(data.workerId);
    }

    const existing = await this.appointments.findById(id, userId);
    if (!existing) throw new NotFoundError(`Appointment with id ${id} not found`);

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

    if (data.workerId !== undefined && data.workerId !== existing.workerId) {
      if (data.workerId === null) {
        existing.workerId = null;
        existing.workerName = null;
      } else {
        const worker = await this.workers.findById(data.workerId, userId);
        if (!worker) throw new NotFoundError(`Worker with id ${data.workerId} not found`);
        existing.workerId = worker.id!;
        existing.workerName = worker.name;
      }
    }

    if (data.startTime || data.endTime) {
      const start = data.startTime ? new Date(data.startTime) : existing.startTime;
      const end = data.endTime ? new Date(data.endTime) : existing.endTime;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestError('Invalid date format');
      }

      if (start >= end) {
        throw new BadRequestError('startTime must be before endTime');
      }

      if (existing.workerId != null) {
        const worker = await this.workers.findById(existing.workerId, userId);
        if (worker && worker.maxSimultaneous != null) {
          const concurrent = await this.appointments.countConcurrent(existing.workerId, start, end);

          if (concurrent >= worker.maxSimultaneous) {
            throw new ConflictError(
              `Worker can only handle ${worker.maxSimultaneous} appointment(s) simultaneously`
            );
          }
        }
      }

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
