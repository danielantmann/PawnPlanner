import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../core/users/domain/IUserRepository';
import { User } from '../../core/users/domain/User';
import { dataSource } from '../orm';

@injectable()
export class UserRepository implements IUserRepository {
  private ormRepo: Repository<User>;

  constructor() {
    this.ormRepo = dataSource.getRepository(User);
  }

  async save(user: User): Promise<User> {
    return await this.ormRepo.save(user);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const existingUser = await this.ormRepo.findOne({ where: { id } });
    if (!existingUser) return null;

    const updatedUser = Object.assign(existingUser, data);
    return await this.ormRepo.save(updatedUser);
  }

  async findById(id: number): Promise<User | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return await this.ormRepo.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.ormRepo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
