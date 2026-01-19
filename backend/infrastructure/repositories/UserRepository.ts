import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';

import { UserEntity } from '../orm/entities/UserEntity';
import { User } from '../../core/users/domain/User';
import { IUserRepository } from '../../core/users/domain/IUserRepository';
import { AppDataSource } from '../orm/data-source';

@injectable()
export class UserRepository implements IUserRepository {
  private ormRepo: Repository<UserEntity>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.secondLastName ?? null,
      entity.email,
      entity.passwordHash
    );
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();

    if (domain.id !== null) {
      entity.id = domain.id;
    }

    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.secondLastName = domain.secondLastName ?? undefined;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;

    return entity;
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<User | null> {
    const existing = await this.ormRepo.findOne({ where: { id } });
    if (!existing) return null;

    Object.assign(existing, data);
    const saved = await this.ormRepo.save(existing);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.ormRepo.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
