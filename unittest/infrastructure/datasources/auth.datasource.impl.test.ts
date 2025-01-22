import { beforeEach, describe, it, vi } from 'vitest';
import { AuthDataSourceImpl } from '../../../src/infrastructure';

vi.mock("env-var", () => ({
  get: vi.fn(() => ({
    required: vi.fn().mockReturnValue({
      asPortNumber: vi.fn().mockReturnValue(3000),
      asString: vi.fn().mockReturnValue("dummy-value"),
    }),
  })),
}));

vi.mock('mongoose', () => ({
  isValidObjectId: vi.fn().mockImplementation(() => true),
}));

vi.mock('../../../src/data/mongodb/models/user.model.ts', () => ({
  UserModel: {
    findById: vi.fn().mockResolvedValue({
      _id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
      roles: ['role'],
    }),
  },
}));

vi.mock('../../../src/data/mongodb/models/url.model.ts', () => ({
  UrlModel: {
    find: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({
      _id: 'urlId',
      originalUrl: 'originalUrl',
      shortUrl: 'shortUrl',
      userId: 'userId',
    }),
  },
}));

vi.mock('../../../src/data/mongodb/models/reset-password-token.model.ts', () => ({
  ResetPasswordTokenModel: {
    create: vi.fn().mockResolvedValue({
      _id: 'resetPasswordTokenId',
      userId: 'userId',
    })
  }
}));

describe('AuthDatasourceImpl - get user', () => {

  let authDataSource: AuthDataSourceImpl;

  const hashPasswordMock = vi.fn((password: string) => `hashed-${password}`);
  const comparePasswordMock = vi.fn();

  beforeEach(() => {
    authDataSource = new AuthDataSourceImpl(hashPasswordMock, comparePasswordMock);
    vi.clearAllMocks();
  });

  it('should return user if user exists', async () => {
    await authDataSource.getUser('userId');
  });

});