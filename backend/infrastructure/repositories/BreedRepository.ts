import { injectable } from 'tsyringe';
import { IBreedRepository } from '../../core/breeds/domain/IBreedRepository';
import { Breed } from '../../core/breeds/domain/Breed';
import { Repository } from 'typeorm';
import { AppDataSource } from '../orm/data-source';

@injectable()
export class BreedRepository implements IBreedRepository {
  private ormRepo: Repository<Breed>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Breed);
  }

  async save(breed: Breed): Promise<Breed> {
    return await this.ormRepo.save(breed);
  }

  async update(breed: Breed): Promise<Breed | null> {
    const existing = await this.ormRepo.findOne({ where: { id: breed.id } });
    if (!existing) return null;

    existing.name = breed.name ?? existing.name;
    existing.animal = breed.animal ?? existing.animal;

    return await this.ormRepo.save(existing);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async findById(id: number): Promise<Breed | null> {
    return await this.ormRepo.findOne({
      where: { id },
      relations: ['animal'],
    });
  }

  async findByName(name: string): Promise<Breed[]> {
    return await this.ormRepo.find({
      where: { name },
      relations: ['animal'],
    });
  }

  async findAll(): Promise<Breed[]> {
    return await this.ormRepo.find({ relations: ['animal'] });
  }

  async findByAnimal(animalId: number): Promise<Breed[]> {
    return this.ormRepo.find({
      where: { animal: { id: animalId } },
      relations: ['animal'],
    });
  }
}
