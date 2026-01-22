import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';

import { ServiceEntity } from '../orm/entities/ServiceEntity';
import { Service } from '../../core/services/domain/Service';
import { IServiceRepository } from '../../core/services/domain/IServiceRepository';

@injectable()
export class ServiceRepository implements IServiceRepository {
  private ormRepo: Repository<ServiceEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(ServiceEntity);
  }

  private toDomain(entity: ServiceEntity): Service {
    return new Service(
      entity.id,
      entity.name,
      entity.description ?? null,
      Number(entity.price),
      entity.createdByUser.id
    );
  }

  async findById(id: number, userId: number): Promise<Service | null> {
    const entity = await this.ormRepo.findOne({
      where: { id, createdByUser: { id: userId } },
      relations: ['createdByUser'],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(userId: number): Promise<Service[]> {
    const entities = await this.ormRepo.find({
      where: { createdByUser: { id: userId } },
      relations: ['createdByUser'],
    });

    return entities.map((e) => this.toDomain(e));
  }
}
