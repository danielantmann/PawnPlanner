import { injectable, inject } from 'tsyringe';

import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';

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
    @inject('BreedRepository') private breeds: IBreedRepository,
    @inject('AppointmentRepository') private appointments: IAppointmentRepository,
    @inject('WorkerRepository') private workers: IWorkerRepository
  ) {}

  async execute(dto: CreateAppointmentDTO, userId: number) {
    const pet = await this.pets.findById(dto.petId, userId);
    if (!pet) throw new NotFoundError(`Pet with id ${dto.petId} not found`);

    const owner = await this.owners.findById(pet.ownerId, userId);
    if (!owner) throw new NotFoundError(`Owner with id ${pet.ownerId} not found`);

    const breed = await this.breeds.findById(pet.breedId, userId);
    if (!breed) throw new NotFoundError(`Breed with id ${pet.breedId} not found`);

    const service = await this.services.findById(dto.serviceId, userId);
    if (!service) throw new NotFoundError(`Service with id ${dto.serviceId} not found`);

    let worker = null;
    let workerName: string | null = null;
    if (dto.workerId) {
      worker = await this.workers.findById(dto.workerId, userId);
      if (!worker) throw new NotFoundError(`Worker with id ${dto.workerId} not found`);
      workerName = worker.name;
    }

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    if (start >= end) {
      throw new BadRequestError('startTime must be before endTime');
    }

    if (worker && worker.maxSimultaneous != null) {
      const concurrent = await this.appointments.countConcurrent(worker.id!, start, end);

      if (concurrent >= worker.maxSimultaneous) {
        throw new ConflictError(
          `Worker can only handle ${worker.maxSimultaneous} appointment(s) simultaneously`
        );
      }
    }

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    const estimatedPrice = Number(service.price);
    const finalPrice = dto.finalPrice !== undefined ? dto.finalPrice : estimatedPrice;

    if (finalPrice < 0) {
      throw new BadRequestError('finalPrice cannot be negative');
    }

    const appointment = new Appointment(
      null,
      userId,
      pet.id!,
      owner.id!,
      service.id!,
      worker?.id || null,

      pet.name,
      breed.name,
      owner.name,
      owner.phone,

      service.name,
      workerName,
      estimatedPrice,
      finalPrice,

      start,
      end,
      durationMinutes,

      'completed',
      false
    );

    const saved = await this.appointments.create(appointment);
    return AppointmentMapper.toDTO(saved);
  }
}
