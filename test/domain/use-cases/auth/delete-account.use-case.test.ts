import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, DeleteAccount } from '../../../../src/domain';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../../../src/infrastructure';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';

describe('delete account use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should delete account', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'deleteAccount').mockResolvedValue(expectedUser);
    const result = await new DeleteAccount(authRepository).execute('userId');
    expect(result).toEqual(expectedUser);
    expect(authRepository.deleteAccount).toHaveBeenCalledExactlyOnceWith('userId');
  });
});