import { injectable } from 'tsyringe';
import { Like, Repository } from 'typeorm';
import { Pet } from '../../core/pets/domain/Pet';
import { IPetRepository } from '../../core/pets/domain/IPetRepository';
import { dataSource } from '../orm';

@injectable()
export class PetRepository implements IPetRepository {
  private ormRepo: Repository<Pet>;

  constructor() {
    this.ormRepo = dataSource.getRepository(Pet);
  }

  async save(pet: Pet): Promise<Pet> {
    return await this.ormRepo.save(pet);
  }

  async update(id: number, data: Partial<Pet>, userId: number): Promise<Pet | null> {
    const existing = await this.ormRepo.findOne({
      where: { id, userId },
      relations: ['owner', 'breed'],
    });

    if (!existing) return null;

    Object.assign(existing, data);
    return await this.ormRepo.save(existing);
  }

  async findById(id: number, userId: number): Promise<Pet | null> {
    return await this.ormRepo.findOne({
      where: { id, userId },
      relations: ['owner', 'breed'],
    });
  }

  async findAll(userId: number): Promise<Pet[]> {
    return await this.ormRepo.find({
      where: { userId },
      relations: ['owner', 'breed'],
    });
  }

  async findByName(name: string, userId: number): Promise<Pet[]> {
    const normalized = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    return await this.ormRepo.find({
      where: [{ searchName: Like(`%${normalized}%`), userId }],
      relations: ['owner', 'breed'],
    });
  }

  async findByBreed(breedId: number, userId: number): Promise<Pet[]> {
    return await this.ormRepo.find({
      where: { breed: { id: breedId }, userId },
      relations: ['owner', 'breed'],
    });
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }
}
