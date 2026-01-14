import { injectable } from 'tsyringe';
import { IOwnerRepository } from '../../core/owners/domain/IOwnerRepository';
import { Repository } from 'typeorm';
import { Owner } from '../../core/owners/domain/Owner';
import { dataSource } from '../orm';

@injectable()
export class OwnerRepository implements IOwnerRepository {
  private ormRepo: Repository<Owner>;

  constructor() {
    this.ormRepo = dataSource.getRepository(Owner);
  }

  async create(owner: Owner): Promise<Owner> {
    return await this.ormRepo.save(owner);
  }

  async update(id: number, owner: Partial<Owner>, userId: number): Promise<Owner | null> {
    const existingOwner = await this.ormRepo.findOne({
      where: { id, userId },
    });

    if (!existingOwner) return null;

    const updated = Object.assign(existingOwner, owner);
    return await this.ormRepo.save(updated);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }

  async findAll(userId: number): Promise<Owner[]> {
    return await this.ormRepo.find({
      where: { userId },
      relations: ['pets'],
    });
  }

  async findById(id: number, userId: number): Promise<Owner | null> {
    return await this.ormRepo.findOne({
      where: { id, userId },
      relations: ['pets'],
    });
  }

  async findByName(name: string, userId: number): Promise<Owner[]> {
    return await this.ormRepo.find({
      where: { name: name.toLowerCase().trim(), userId },
      relations: ['pets'],
    });
  }

  async findByEmail(email: string, userId: number): Promise<Owner | null> {
    return await this.ormRepo.findOne({
      where: { email: email.toLowerCase().trim(), userId },
      relations: ['pets'],
    });
  }

  async findByPhone(phone: string, userId: number): Promise<Owner | null> {
    return await this.ormRepo.findOne({
      where: { phone: phone.trim(), userId },
    });
  }
}
