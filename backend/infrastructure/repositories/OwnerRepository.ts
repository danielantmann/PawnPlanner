import { injectable } from 'tsyringe';
import { Repository, Like } from 'typeorm';

import { OwnerEntity } from '../orm/entities/OwnerEntity';
import { Owner } from '../../core/owners/domain/Owner';
import { IOwnerRepository } from '../../core/owners/domain/IOwnerRepository';
import { AppDataSource } from '../orm/data-source';

@injectable()
export class OwnerRepository implements IOwnerRepository {
  private ormRepo: Repository<OwnerEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(OwnerEntity);
  }

  // ORM → Dominio
  private toDomain(entity: OwnerEntity): Owner {
    return new Owner(
      entity.id,
      entity.name,
      entity.searchName,
      entity.email,
      entity.phone,
      entity.userId
    );
  }

  private toEntity(domain: Owner): OwnerEntity {
    const entity = new OwnerEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.name = domain.name;
    entity.searchName = domain.searchName;
    entity.email = domain.email;
    entity.phone = domain.phone;
    entity.userId = domain.userId;

    return entity;
  }

  async create(owner: Owner): Promise<Owner> {
    const entity = this.toEntity(owner);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, owner: Partial<Owner>, userId: number): Promise<Owner | null> {
    const existing = await this.ormRepo.findOne({ where: { id, userId } });
    if (!existing) return null;

    Object.assign(existing, owner);
    const saved = await this.ormRepo.save(existing);
    return this.toDomain(saved);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }

  async findAll(userId: number): Promise<Owner[]> {
    const entities = await this.ormRepo.find({ where: { userId } });
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number, userId: number): Promise<Owner | null> {
    const entity = await this.ormRepo.findOne({ where: { id, userId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string, userId: number): Promise<Owner[]> {
    const normalized = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    const entities = await this.ormRepo.find({
      where: {
        searchName: Like(`%${normalized}%`),
        userId,
      },
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findByEmail(email: string, userId: number): Promise<Owner | null> {
    const entity = await this.ormRepo.findOne({
      where: { email: email.toLowerCase().trim(), userId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPhone(phone: string, userId: number): Promise<Owner | null> {
    const entity = await this.ormRepo.findOne({
      where: { phone: phone.trim(), userId },
    });
    return entity ? this.toDomain(entity) : null;
  }
}
