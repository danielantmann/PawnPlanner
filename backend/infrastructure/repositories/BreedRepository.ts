import { injectable } from 'tsyringe';
import { IBreedRepository } from '../../core/breeds/domain/IBreedRepository';
import { Breed } from '../../core/breeds/domain/Breed';
import { Repository, IsNull } from 'typeorm';
import { dataSource } from '../orm';

@injectable()
export class BreedRepository implements IBreedRepository {
  private ormRepo: Repository<Breed>;

  constructor() {
    this.ormRepo = dataSource.getRepository(Breed);
  }

  async save(breed: Breed): Promise<Breed> {
    return await this.ormRepo.save(breed);
  }

  async update(id: number, data: Partial<Breed>, userId: number): Promise<Breed | null> {
    const existing = await this.ormRepo.findOne({
      where: [
        { id, userId }, // privadas
        { id, userId: IsNull() }, // globales
      ],
      relations: ['animal', 'pets'],
    });

    if (!existing) return null;

    Object.assign(existing, data);
    return await this.ormRepo.save(existing);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    // Solo borra privadas
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }

  async findById(id: number, userId: number): Promise<Breed | null> {
    return await this.ormRepo.findOne({
      where: [
        { id, userId }, // privadas
        { id, userId: IsNull() }, // globales
      ],
      relations: ['animal'],
    });
  }

  async findByName(name: string, userId: number): Promise<Breed[]> {
    return await this.ormRepo.find({
      where: [
        { name, userId },
        { name, userId: IsNull() },
      ],
      relations: ['animal'],
    });
  }

  async findAll(userId: number): Promise<Breed[]> {
    return await this.ormRepo.find({
      where: [
        { userId }, // privadas
        { userId: IsNull() }, // globales
      ],
      relations: ['animal'],
    });
  }

  async findByAnimal(animalId: number, userId: number): Promise<Breed[]> {
    return await this.ormRepo.find({
      where: [
        { animalId, userId },
        { animalId, userId: IsNull() },
      ],
      relations: ['animal'],
    });
  }

  async findByNameAndAnimal(name: string, animalId: number, userId: number): Promise<Breed | null> {
    return await this.ormRepo.findOne({
      where: [
        { name, animalId, userId },
        { name, animalId, userId: IsNull() },
      ],
    });
  }
}
