import { User } from './User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User | null>;

  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
