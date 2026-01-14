import { Owner } from './Owner';

export interface IOwnerRepository {
  create(owner: Owner): Promise<Owner>;
  update(id: number, owner: Partial<Owner>, userId: number): Promise<Owner | null>;
  delete(id: number, userId: number): Promise<boolean>;
  findAll(userId: number): Promise<Owner[]>;
  findById(id: number, userId: number): Promise<Owner | null>;
  findByName(name: string, userId: number): Promise<Owner[]>;
  findByEmail(email: string, userId: number): Promise<Owner | null>;
  findByPhone(phone: string, userId: number): Promise<Owner | null>;
}
