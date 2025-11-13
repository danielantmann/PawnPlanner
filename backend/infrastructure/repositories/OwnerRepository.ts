import { injectable } from 'tsyringe';
import { IOwnerRepository } from '../../core/owners/domain/IOwnerRepository';
import { AppDataSource } from '../orm/data-source';
import { Repository } from 'typeorm';
import { Owner } from '../../core/owners/domain/Owner';

@injectable()
export class OwnerRepository implements IOwnerRepository {
  private ormRepo: Repository<Owner>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Owner);
  }
  async create(owner: Owner): Promise<Owner> {
    return await this.ormRepo.save(owner);
  }

  async update(id: number, owner: Partial<Owner>): Promise<Owner | null> {
    const existingOwner = await this.ormRepo.findOne({ where: { id } });

    if (!existingOwner) return null;

    const updateOwner = Object.assign(existingOwner, owner);
    return await this.ormRepo.save(updateOwner);
  }

  async delete(id: number): Promise<boolean> {
    const owner = await this.ormRepo.delete(id);
    return !!owner.affected && owner.affected > 0;
  }

  async findAll(): Promise<Owner[]> {
    return await this.ormRepo.find({ relations: ['pets'] });
  }

  async findById(id: number): Promise<Owner | null> {
    return await this.ormRepo.findOne({ where: { id }, relations: ['pets'] });
  }

  async findByName(name: string): Promise<Owner | null> {
    return await this.ormRepo.findOne({ where: { name }, relations: ['pets'] });
  }

  async findByEmail(email: string): Promise<Owner | null> {
    return await this.ormRepo.findOne({ where: { email }, relations: ['pets'] });
  }
}
