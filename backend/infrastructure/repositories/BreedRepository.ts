import { injectable } from 'tsyringe';
import { Repository, IsNull, DataSource } from 'typeorm';

import { BreedEntity } from '../orm/entities/BreedEntity';
import { Breed } from '../../core/breeds/domain/Breed';
import { IBreedRepository } from '../../core/breeds/domain/IBreedRepository';

@injectable()
export class BreedRepository implements IBreedRepository {
  private ormRepo: Repository<BreedEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(BreedEntity);
  }

  private toDomain(entity: BreedEntity): Breed {
    return new Breed(entity.id, entity.name, entity.searchName, entity.animalId, entity.userId);
  }

  private toEntity(domain: Breed): BreedEntity {
    const entity = new BreedEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.name = domain.name;
    entity.searchName = domain.searchName;
    entity.animalId = domain.animalId;
    entity.userId = domain.userId;

    return entity;
  }

  async save(breed: Breed): Promise<Breed> {
    const entity = this.toEntity(breed);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<BreedEntity>, userId: number): Promise<Breed | null> {
    const existing = await this.ormRepo.findOne({
      where: [
        { id, userId },
        { id, userId: IsNull() },
      ],
    });

    if (!existing) return null;

    Object.assign(existing, data);
    const saved = await this.ormRepo.save(existing);
    return this.toDomain(saved);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }

  async findById(id: number, userId: number): Promise<Breed | null> {
    const entity = await this.ormRepo.findOne({
      where: [
        { id, userId },
        { id, userId: IsNull() },
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string, userId: number): Promise<Breed[]> {
    const entities = await this.ormRepo.find({
      where: [
        { name, userId },
        { name, userId: IsNull() },
      ],
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findAll(userId: number): Promise<Breed[]> {
    const entities = await this.ormRepo.find({
      where: [{ userId }, { userId: IsNull() }],
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findByAnimal(animalId: number, userId: number): Promise<Breed[]> {
    const entities = await this.ormRepo.find({
      where: [
        { animalId, userId },
        { animalId, userId: IsNull() },
      ],
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findByNameAndAnimal(name: string, animalId: number, userId: number): Promise<Breed | null> {
    const entity = await this.ormRepo.findOne({
      where: [
        { name, animalId, userId },
        { name, animalId, userId: IsNull() },
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }
}
