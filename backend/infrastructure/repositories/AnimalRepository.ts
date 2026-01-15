import { Repository, IsNull } from 'typeorm';
import { injectable } from 'tsyringe';
import { IAnimalRepository } from '../../core/animals/domain/IAnimalRepository';
import { Animal } from '../../core/animals/domain/Animal';
import { dataSource } from '../orm';

@injectable()
export class AnimalRepository implements IAnimalRepository {
  private ormRepo: Repository<Animal>;

  constructor() {
    this.ormRepo = dataSource.getRepository(Animal);
  }

  async create(animal: Animal): Promise<Animal> {
    return await this.ormRepo.save(animal);
  }

  async update(id: number, data: Partial<Animal>, userId: number): Promise<Animal | null> {
    const existing = await this.ormRepo.findOne({
      where: { id, userId },
    });

    if (!existing) return null;

    Object.assign(existing, data);
    return await this.ormRepo.save(existing);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }

  async findAll(userId: number): Promise<Animal[]> {
    return await this.ormRepo.find({
      where: [
        { userId: IsNull() }, // globales
        { userId }, // privados
      ],
      relations: ['breeds'],
    });
  }

  async findById(id: number, userId: number): Promise<Animal | null> {
    return await this.ormRepo.findOne({
      where: [
        { id, userId: IsNull() }, // global
        { id, userId }, // privado
      ],
      relations: ['breeds'],
    });
  }

  async findBySpecies(species: string, userId: number): Promise<Animal[]> {
    return await this.ormRepo.find({
      where: [
        { species, userId: IsNull() }, // globales
        { species, userId }, // privados
      ],
      relations: ['breeds'],
    });
  }
}
