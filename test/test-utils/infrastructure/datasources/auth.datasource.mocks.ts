import { vi } from 'vitest';
import { User } from '../../../../src/domain';

export class AuthDataSourceMocks {

  static readonly user: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    password: 'hashed-password',
    role: ['role'],
  };

  static readonly googleUser: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    googleId: 'googleId',
    role: ['role'],
  };

  static readonly registerUserDto = {
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    password: 'password',
  };

  static readonly loginUserDto = {
    email: 'email',
    password: 'password',
  };

  static readonly users: User[] = [
    {
      id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email',
      password: 'hashed-password',
      role: ['role'],
    },
    {
      id: 'userId2',
      name: 'name2',
      lastName: 'lastName2',
      email: 'email2',
      password: 'hashed-password2',
      role: ['role2'],
    },
    {
      id: 'userId3',
      name: 'name3',
      lastName: 'lastName3',
      email: 'email3',
      password: 'hashed-password3',
      role: ['role3'],
    }
  ];

  static readonly updateUserDto = {
    name: 'nameUpdated',
    lastName: 'lastNameUpdated',
    email: 'email',  
  }

  static readonly updatedUser: User = {
    id: 'userId',
    name: 'nameUpdated',
    lastName: 'lastNameUpdated',
    email: 'email',
    password: 'hashed-password',
    role: ['role'],
  };

  static setupMocks() {
    vi.mock('mongoose', () => ({
      isValidObjectId: vi.fn().mockImplementation(() => true),
    }));

    vi.mock('../../../../src/data/mongodb/models/user.model.ts', () => ({
      UserModel: {
        findById: vi.fn().mockResolvedValue({
          _id: 'userId',
          name: 'name',
          lastName: 'lastName',
          email: 'email',
          password: 'hashed-password',
          role: ['role']
        }),
        find: vi.fn().mockResolvedValue(AuthDataSourceMocks.users),
        findOne: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          _id: 'userId',
          name: 'name',
          lastName: 'lastName',
          email: 'email',
          password: 'hashed-password',
          role: ['role'],
          save: vi.fn()
        }),
        findByIdAndUpdate: vi.fn().mockResolvedValue(AuthDataSourceMocks.updatedUser),
      },
    }));

    vi.mock('../../../../src/data/mongodb/models/url.model.ts', () => ({
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

    vi.mock('../../../../src/data/mongodb/models/reset-password-token.model.ts', () => ({
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
