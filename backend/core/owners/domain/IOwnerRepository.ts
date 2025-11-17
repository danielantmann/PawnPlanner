import { Owner } from './Owner';

export interface IOwnerRepository {
  create(owner: Owner): Promise<Owner>;
  update(id: number, owner: Partial<Owner>): Promise<Owner | null>;
  delete(id: number): Promise<boolean>;
  save(owner: Owner): Promise<Owner>;
  findAll(): Promise<Owner[]>;
  findById(id: number): Promise<Owner | null>;
  findByName(name: string): Promise<Owner[] | null>;
  findByEmail(email: string): Promise<Owner | null>;
  findByPhone(phone: string): Promise<Owner | null>;
}
