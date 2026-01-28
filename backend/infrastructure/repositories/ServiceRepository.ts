import { injectable } from 'tsyringe';
import { Repository, IsNull, DataSource } from 'typeorm';

import { Service } from '../../core/services/domain/Service';
import { IServiceRepository } from '../../core/services/domain/IServiceRepository';
import { ServiceEntity } from '../orm/entities/ServiceEntity';

@injectable()
export class ServiceRepository implements IServiceRepository {
  private readonly repo: Repository<ServiceEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = dataSource.getRepository(ServiceEntity);
  }

  private toDomain(entity: ServiceEntity): Service {
    return new Service(
      entity.id,
      entity.name,
      Number(entity.price),
      entity.createdByUser ? entity.createdByUser.id : null
    );
  }

  async findById(id: number, userId: number): Promise<Service | null> {
    const entity = await this.repo.findOne({
      where: [
        { id, createdByUser: { id: userId } },
        { id, createdByUser: IsNull() },
      ],
      relations: ['createdByUser'],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(userId: number): Promise<Service[]> {
    const entities = await this.repo.find({
      where: [{ createdByUser: { id: userId } }, { createdByUser: IsNull() }],
      relations: ['createdByUser'],
      order: { name: 'ASC' },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async create(service: Service): Promise<Service> {
    const entity = this.repo.create({
      name: service.name,
      price: service.price,
      createdByUser: service.userId ? { id: service.userId } : null,
    });

    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(service: Service): Promise<Service | null> {
    const entity = await this.repo.findOne({
      where: [
        { id: service.id!, createdByUser: { id: service.userId! } },
        { id: service.id!, createdByUser: IsNull() },
      ],
      relations: ['createdByUser'],
    });

    if (!entity) return null;

    entity.name = service.name;
    entity.price = service.price;

    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.repo.delete({
      id,
      createdByUser: { id: userId },
    });
  }
}
