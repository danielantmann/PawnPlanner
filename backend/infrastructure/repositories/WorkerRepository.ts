import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { WorkerEntity } from '../orm/entities/WorkerEntity';
import { Worker } from '../../core/workers/domain/Worker';
import { IWorkerRepository } from '../../core/workers/domain/IWorkerRepository';

@injectable()
export class WorkerRepository implements IWorkerRepository {
  private ormRepo: Repository<WorkerEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(WorkerEntity);
  }

  private toDomain(entity: WorkerEntity): Worker {
    return new Worker(
      entity.id,
      entity.userId,
      entity.name,
      entity.phone,
      entity.isActive,
      entity.maxSimultaneous ?? null
    );
  }

  private toEntity(domain: Worker): WorkerEntity {
    const entity = new WorkerEntity();
    if (domain.id !== null) entity.id = domain.id;
    entity.userId = domain.userId;
    entity.name = domain.name;
    entity.phone = domain.phone;
    entity.isActive = domain.isActive;
    entity.maxSimultaneous = domain.maxSimultaneous === undefined ? null : domain.maxSimultaneous;
    return entity;
  }

  async create(worker: Worker): Promise<Worker> {
    const entity = this.toEntity(worker);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(worker: Worker): Promise<Worker | null> {
    const existing = await this.ormRepo.findOne({
      where: { id: worker.id!, userId: worker.userId },
    });
    if (!existing) return null;
    const merged = this.ormRepo.merge(existing, this.toEntity(worker));
    const saved = await this.ormRepo.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.ormRepo.delete({ id, userId });
  }

  async findById(id: number, userId: number): Promise<Worker | null> {
    const entity = await this.ormRepo.findOne({ where: { id, userId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(userId: number): Promise<Worker[]> {
    const entities = await this.ormRepo.find({ where: { userId, isActive: true } });
    return entities.map((e) => this.toDomain(e));
  }
}
