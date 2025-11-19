import { injectable } from 'tsyringe';
import { IBreedRepository } from '../../core/breeds/domain/IBreedRepository';
import { Breed } from '../../core/breeds/domain/Breed';
import { Repository } from 'typeorm';
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

  async update(id: number, data: Partial<Breed>): Promise<Breed | null> {
    const existing = await this.ormRepo.findOne({ where: { id }, relations: ['animal', 'pets'] });
    if (!existing) return null;

    Object.assign(existing, data);
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

  async findByNameAndAnimal(name: string, animalId: number): Promise<Breed | null> {
    return await this.ormRepo.findOne({
      where: { name, animalId },
    });
  }
}
