import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { UpdateUser, UpdateUserDto } from '../../../../src/domain';

describe('update user use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should update user', async () => {
    const [error, updateUserDto] = UpdateUserDto.create({
      name: 'new name',
      lastName: 'new last name',
    });
    expect(error).toBeUndefined();
    const expectedUser = AuthDataSourceMocks.updatedUser;
    vi.spyOn(authRepository, 'updateUser').mockResolvedValue(expectedUser);
    const result = await new UpdateUser(authRepository).execute('userId', updateUserDto!);
    expect(authRepository.updateUser).toHaveBeenCalledExactlyOnceWith('userId', updateUserDto!);
    expect(result).toEqual(expectedUser);
  });

});