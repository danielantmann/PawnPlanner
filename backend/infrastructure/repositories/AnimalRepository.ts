import { injectable } from 'tsyringe';
import { Repository, IsNull, DataSource } from 'typeorm';

import { AnimalEntity } from '../orm/entities/AnimalEntity';
import { Animal } from '../../core/animals/domain/Animal';
import { IAnimalRepository } from '../../core/animals/domain/IAnimalRepository';

@injectable()
export class AnimalRepository implements IAnimalRepository {
  private ormRepo: Repository<AnimalEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(AnimalEntity);
  }

  private toDomain(entity: AnimalEntity): Animal {
    return new Animal(entity.id, entity.species, entity.userId);
  }

  private toEntity(domain: Animal): AnimalEntity {
    const entity = new AnimalEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.species = domain.species;
    entity.userId = domain.userId;

    return entity;
  }

  async create(animal: Animal): Promise<Animal> {
    const entity = this.toEntity(animal);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<AnimalEntity>, userId: number): Promise<Animal | null> {
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

  async findAll(userId: number): Promise<Animal[]> {
    const entities = await this.ormRepo.find({
      where: [{ userId }, { userId: IsNull() }],
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number, userId: number): Promise<Animal | null> {
    const entity = await this.ormRepo.findOne({
      where: [
        { id, userId },
        { id, userId: IsNull() },
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findBySpecies(species: string, userId: number): Promise<Animal[]> {
    const entities = await this.ormRepo.find({
      where: [
        { species, userId },
        { species, userId: IsNull() },
      ],
    });

    return entities.map((e) => this.toDomain(e));
  }
}
