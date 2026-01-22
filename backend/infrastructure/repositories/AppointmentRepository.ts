import { injectable } from 'tsyringe';
import { Repository, DataSource, Between } from 'typeorm';

import { AppointmentEntity } from '../orm/entities/AppointmentEntity';
import { Appointment } from '../../core/appointments/domain/Appointment';
import { IAppointmentRepository } from '../../core/appointments/domain/IAppointmentRepository';

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private ormRepo: Repository<AppointmentEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(AppointmentEntity);
  }

  // ORM → Dominio
  private toDomain(entity: AppointmentEntity): Appointment {
    return new Appointment(
      entity.id,
      entity.userId,
      entity.petId,
      entity.serviceId,

      entity.petName,
      entity.ownerName,
      entity.ownerPhone,

      entity.serviceName,
      Number(entity.estimatedPrice),
      Number(entity.finalPrice),

      entity.startTime,
      entity.endTime,
      entity.durationMinutes,

      entity.status,
      entity.reminderSent
    );
  }

  // Dominio → ORM
  private toEntity(domain: Appointment): AppointmentEntity {
    const entity = new AppointmentEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.userId = domain.userId;
    entity.petId = domain.petId;
    entity.serviceId = domain.serviceId;

    entity.petName = domain.petName;
    entity.ownerName = domain.ownerName;
    entity.ownerPhone = domain.ownerPhone;

    entity.serviceName = domain.serviceName;
    entity.estimatedPrice = domain.estimatedPrice;
    entity.finalPrice = domain.finalPrice;

    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    entity.durationMinutes = domain.durationMinutes;

    entity.status = domain.status;
    entity.reminderSent = domain.reminderSent;

    return entity;
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const entity = this.toEntity(appointment);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(appointment: Appointment): Promise<Appointment | null> {
    const existing = await this.ormRepo.findOne({
      where: { id: appointment.id!, userId: appointment.userId },
    });

    if (!existing) return null;

    const merged = this.ormRepo.merge(existing, this.toEntity(appointment));
    const saved = await this.ormRepo.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.ormRepo.delete({ id, userId });
  }

  async findById(id: number, userId: number): Promise<Appointment | null> {
    const entity = await this.ormRepo.findOne({
      where: { id, userId },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findOverlapping(userId: number, startTime: Date, endTime: Date): Promise<Appointment[]> {
    // Encuentra citas que se solapan con el rango [startTime, endTime)
    // Una cita A se solapa con [startTime, endTime) si:
    // A.startTime < endTime AND A.endTime > startTime
    const entities = await this.ormRepo.find({
      where: {
        userId,
        startTime: Between(startTime, new Date(endTime.getTime() - 1)),
      },
    });

    // Filtramos para asegurar que las citas realmente se solapan
    return entities
      .filter((e) => e.endTime > startTime && e.startTime < endTime)
      .map((e) => this.toDomain(e));
  }

  async findByDateRange(userId: number, start: Date, end: Date): Promise<Appointment[]> {
    const entities = await this.ormRepo.find({
      where: {
        userId,
        startTime: Between(start, end),
      },
      order: { startTime: 'ASC' },
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findCompletedInRange(userId: number, start: Date, end: Date): Promise<Appointment[]> {
    const entities = await this.ormRepo.find({
      where: {
        userId,
        status: 'completed',
        startTime: Between(start, end),
      },
      order: { startTime: 'ASC' },
    });

    return entities.map((e) => this.toDomain(e));
  }
}
