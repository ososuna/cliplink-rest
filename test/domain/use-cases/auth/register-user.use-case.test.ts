import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { RegisterUser, RegisterUserDto } from '../../../../src/domain';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { Messages } from '../../../../src/config';

describe('register user use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should register a new user', async () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'Tyler',
      lastName: 'Joseph',
      email: 'tyler@top.com',
      password: '12345678'
    });
    expect(error).toBeUndefined();

    const expectedUser = AuthDataSourceMocks.user;
    const signToken = vi.fn(async () => 'token');
    
    vi.spyOn(authRepository, 'register').mockResolvedValue(expectedUser);

    const result = await new RegisterUser(authRepository, signToken)
      .execute(registerUserDto!);
    
    expect(authRepository.register).toHaveBeenCalledWith(registerUserDto);
    expect(result).toEqual({
      token: 'token',
      user: {
        'email': 'email',
        'id': 'userId',
        'lastName': 'lastName',
        'name': 'name',
      }
    });
  });

  it('should throw an error when token generation fails', async () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'Tyler',
      lastName: 'Joseph',
      email: 'tyler@top.com',
      password: '12345678'
    });
    expect(error).toBeUndefined();

    const expectedUser = AuthDataSourceMocks.user;
    const signToken = vi.fn(async () => null);
    
    vi.spyOn(authRepository, 'register').mockResolvedValue(expectedUser);

    await expect(new RegisterUser(authRepository, signToken).execute(registerUserDto!))
      .rejects.toThrow(Messages.TOKEN_GENERATION_ERROR);
  });

});