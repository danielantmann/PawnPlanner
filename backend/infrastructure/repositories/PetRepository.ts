import { injectable } from 'tsyringe';
import { Repository, Like } from 'typeorm';

import { PetEntity } from '../orm/entities/PetEntity';
import { Pet } from '../../core/pets/domain/Pet';
import { IPetRepository } from '../../core/pets/domain/IPetRepository';
import { AppDataSource } from '../orm/data-source';

@injectable()
export class PetRepository implements IPetRepository {
  private ormRepo: Repository<PetEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(PetEntity);
  }

  // ORM → Dominio
  private toDomain(entity: PetEntity): Pet {
    return new Pet(
      entity.id,
      entity.name,
      entity.searchName,
      entity.birthDate ?? null,
      entity.importantNotes ?? null,
      entity.quickNotes ?? null,
      entity.ownerId,
      entity.breedId,
      entity.userId
    );
  }

  // Dominio → ORM
  private toEntity(domain: Pet): PetEntity {
    const entity = new PetEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.name = domain.name;
    entity.searchName = domain.searchName;

    entity.birthDate = domain.birthDate ?? undefined;
    entity.importantNotes = domain.importantNotes ?? undefined;
    entity.quickNotes = domain.quickNotes ?? undefined;

    entity.ownerId = domain.ownerId;
    entity.breedId = domain.breedId;
    entity.userId = domain.userId;

    return entity;
  }

  async save(pet: Pet): Promise<Pet> {
    const entity = this.toEntity(pet);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<Pet>, userId: number): Promise<Pet | null> {
    const existing = await this.ormRepo.findOne({
      where: { id, userId },
    });

    if (!existing) return null;

    Object.assign(existing, data);
    const saved = await this.ormRepo.save(existing);
    return this.toDomain(saved);
  }

  async findById(id: number, userId: number): Promise<Pet | null> {
    const entity = await this.ormRepo.findOne({
      where: { id, userId },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(userId: number): Promise<Pet[]> {
    const entities = await this.ormRepo.find({
      where: { userId },
    });

    return entities.map((e) => this.toDomain(e));
  }

  async findByName(name: string, userId: number): Promise<Pet[]> {
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

  async findByBreed(breedId: number, userId: number): Promise<Pet[]> {
    const entities = await this.ormRepo.find({
      where: { breedId, userId },
    });

    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id, userId });
    return !!result.affected && result.affected > 0;
  }
}
