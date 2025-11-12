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

  async update(pet: Pet): Promise<Pet | null> {
    const existing = await this.ormRepo.findOne({
      where: { id: pet.id },
      relations: ['owner', 'breed'],
    });
    if (!existing) return null;

    existing.name = pet.name ?? existing.name;
    existing.birthDate = pet.birthDate ?? existing.birthDate;
    existing.importantNotes = pet.importantNotes ?? existing.importantNotes;
    existing.quickNotes = pet.quickNotes ?? existing.quickNotes;
    existing.owner = pet.owner ?? existing.owner;
    existing.breed = pet.breed ?? existing.breed;

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
