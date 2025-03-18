import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { GetUsers } from '../../../../src/domain';

describe('get users use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should get users', async () => {
    const expectedUsers = AuthDataSourceMocks.users;
    vi.spyOn(authRepository, 'getUsers').mockResolvedValue(expectedUsers);
    const result = await new GetUsers(authRepository).execute();
    expect(result).toEqual(expectedUsers);
  });

});