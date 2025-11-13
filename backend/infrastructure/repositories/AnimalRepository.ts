import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';
import { IAnimalRepository } from '../../core/animals/domain/IAnimalRepository';
import { AppDataSource } from '../orm/data-source';
import { Animal } from '../../core/animals/domain/Animal';
import { ConflictError } from '../../shared/errors/ConflictError';
import { NotFoundError } from '../../shared/errors/NotFoundError';

@injectable()
export class AnimalRepository implements IAnimalRepository {
  private ormRepo: Repository<Animal>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Animal);
  }
  async create(animal: Animal): Promise<Animal> {
    return await this.ormRepo.save(animal);
  }

  async update(id: number, species: string): Promise<Animal | null> {
    const existing = await this.ormRepo.findOne({ where: { id } });

    if (!existing) return null;
    existing.species = species ?? existing.species;
    return await this.ormRepo.save(existing);
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async findAll(): Promise<Animal[]> {
    return await this.ormRepo.find({ relations: ['breeds'] });
  }

  async findById(id: number): Promise<Animal | null> {
    return await this.ormRepo.findOne({ where: { id }, relations: ['breeds'] });
  }
  async findBySpecies(species: string): Promise<Animal | null> {
    return await this.ormRepo.findOne({ where: { species }, relations: ['breeds'] });
  }
}
