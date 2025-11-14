import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Pet } from '../../core/pets/domain/Pet';
import { IPetRepository } from '../../core/pets/domain/IPetRepository';
import { AppDataSource } from '../orm/data-source';

@injectable()
export class PetRepository implements IPetRepository {
  private ormRepo: Repository<Pet>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Pet);
  }

  async save(pet: Pet): Promise<Pet> {
    return await this.ormRepo.save(pet);
  }

  async update(id: number, data: Partial<Pet>): Promise<Pet | null> {
    const existing = await this.ormRepo.findOne({ where: { id }, relations: ['owner', 'breed'] });
    if (!existing) return null;

    Object.assign(existing, data);
    return await this.ormRepo.save(existing);
  }

  async findById(id: number): Promise<Pet | null> {
    return await this.ormRepo.findOne({
      where: { id },
      relations: ['owner', 'breed'],
    });
  }

  async findAll(): Promise<Pet[]> {
    return await this.ormRepo.find({ relations: ['owner', 'breed'] });
  }

  async findByName(name: string): Promise<Pet[]> {
    return await this.ormRepo.find({
      where: { name },
      relations: ['owner', 'breed'],
    });
  }

  async findByBreed(breedId: number): Promise<Pet[]> {
    return await this.ormRepo.find({
      where: { breed: { id: breedId } },
      relations: ['owner', 'breed'],
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
