import { Container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { IUserRepository } from '../core/users/domain/IUserRepository';
import { GetUserByIdService } from '../application/users/services/GetUserByIdService';
import { UpdateUserService } from '../application/users/services/UpdateUserService';
import { DeleteUserService } from '../application/users/services/DeleteUserService';

export function setupUserContainer(container: Container, dataSource: DataSource): void {
  container.register<IUserRepository>('UserRepository', {
    useFactory: () => new UserRepository(dataSource),
  });

  container.register(GetUserByIdService, { useClass: GetUserByIdService });
  container.register(UpdateUserService, { useClass: UpdateUserService });
  container.register(DeleteUserService, { useClass: DeleteUserService });
}
