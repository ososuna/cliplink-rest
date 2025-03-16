import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { GetUser } from '../../../../src/domain';

describe('get user use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should get user', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'getUser').mockResolvedValue(expectedUser);
    const result = await new GetUser(authRepository).execute('userId');
    expect(result).toEqual({
      id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email',
    });
  });

});