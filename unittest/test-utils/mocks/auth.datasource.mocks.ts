import { vi } from 'vitest';
import { User } from '../../../src/domain';

export class AuthDataSourceMocks {

  static readonly user: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    password: 'hashed-password',
    role: ['role'],
  };

  static readonly registerUserDto = {
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    password: 'password',
  };

  static setupMocks() {
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
          password: 'hashed-password',
          roles: ['role']
        }),
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          _id: 'userId',
          name: 'name',
          lastName: 'lastName',
          email: 'email',
          password: 'hashed-password',
          roles: ['role'],
          save: vi.fn()
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
        }),
      },
    }));
  }

  static clearMocks() {
    vi.clearAllMocks();
  }
}
