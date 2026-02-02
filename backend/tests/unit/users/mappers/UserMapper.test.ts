import { describe, it, expect } from 'vitest';
import { UserMapper } from '../../../../application/users/mappers/UserMapper';
import { User } from '../../../../core/users/domain/User';

describe('UserMapper', () => {
  it('should map a user with secondLastName', () => {
    const user = new User(1, 'daniel', 'antmann', 'lopez', 'dan@test.com', 'hash');

    const dto = UserMapper.toDTO(user);

    expect(dto).toEqual({
      id: 1,
      firstName: 'Daniel',
      lastName: 'Antmann',
      secondLastName: 'Lopez',
      email: 'dan@test.com',
    });
  });

  it('should map a user without secondLastName', () => {
    const user = new User(1, 'daniel', 'antmann', null, 'dan@test.com', 'hash');

    const dto = UserMapper.toDTO(user);

    expect(dto).toEqual({
      id: 1,
      firstName: 'Daniel',
      lastName: 'Antmann',
      secondLastName: undefined,
      email: 'dan@test.com',
    });
  });
});
