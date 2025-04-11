import { type Mock, vi } from 'vitest';
import { ResetPasswordToken, User } from '@/domain';

export class AuthDataSourceMocks {
  static readonly user: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email',
    password: 'hashed-password',
    role: ['role'],
  };

  static readonly githubUser: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email@github.com',
    githubId: 'githubUserId',
    role: ['role'],
  };

  static readonly googleUser: User = {
    id: 'userId',
    name: 'name',
    lastName: 'lastName',
    email: 'email@gmail.com',
    googleId: 'googleUserId',
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
    },
  ];

  static readonly updateUserDto = {
    name: 'nameUpdated',
    lastName: 'lastNameUpdated',
    email: 'email',
  };

  static readonly updatedUser: User = {
    id: 'userId',
    name: 'nameUpdated',
    lastName: 'lastNameUpdated',
    email: 'email',
    password: 'hashed-password',
    role: ['role'],
  };

  static readonly resetPasswordToken: ResetPasswordToken = {
    id: 'resetPasswordTokenId',
    user: AuthDataSourceMocks.user,
    token: 'token',
    expiresAt: new Date(),
  };

  static readonly validResetPasswordToken: ResetPasswordToken = {
    id: 'resetPasswordTokenId',
    user: AuthDataSourceMocks.user,
    token: 'token',
    expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
  };

  static readonly expiredResetPasswordToken: ResetPasswordToken = {
    id: 'resetPasswordTokenId',
    user: AuthDataSourceMocks.user,
    token: 'token',
    expiresAt: new Date(new Date().getTime() - 60 * 60 * 1000),
  };

  static buildFetchResolvedPromise(body: object, ok: boolean = true, status: number = 200) {
    return Promise.resolve({
      ok,
      status,
      json: vi.fn(() => Promise.resolve(body)),
    });
  }

  static setupMocks() {
    vi.mock('mongoose', () => ({
      isValidObjectId: vi.fn().mockImplementation(() => true),
      Types: {
        ObjectId: vi.fn().mockImplementation(() => 'userId'),
      },
    }));

    vi.mock('../../../../src/data/mongodb/models/user.model.ts', () => ({
      UserModel: {
        findById: vi.fn().mockResolvedValue({
          _id: 'userId',
          name: 'name',
          lastName: 'lastName',
          email: 'email',
          password: 'hashed-password',
          role: ['role'],
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
          save: vi.fn(),
        }),
        findByIdAndUpdate: vi.fn().mockResolvedValue(AuthDataSourceMocks.updatedUser),
        findByIdAndDelete: vi.fn().mockResolvedValue(AuthDataSourceMocks.user),
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
        updateMany: vi.fn().mockResolvedValue({ nModified: 1 }),
      },
    }));

    vi.mock('../../../../src/data/mongodb/models/reset-password-token.model.ts', () => ({
      ResetPasswordTokenModel: {
        create: vi.fn().mockResolvedValue({ ...AuthDataSourceMocks.resetPasswordToken, save: vi.fn() }),
        findOne: vi.fn().mockResolvedValue(AuthDataSourceMocks.resetPasswordToken),
      },
    }));

    globalThis.fetch = vi.fn((url) => {
      let body = {};
      switch (url) {
        case 'https://github.com/login/oauth/access_token':
          body = { access_token: 'fakegithubaccesstoken' };
          break;
        case 'https://api.github.com/user':
          body = {
            id: 'githubUserId',
            email: 'email@github.com',
            name: 'name',
          };
          break;
        case 'https://oauth2.googleapis.com/token':
          body = { access_token: 'fakegoogleaccesstoken' };
          break;
        case 'https://www.googleapis.com/oauth2/v3/userinfo':
          body = {
            sub: 'googleUserId',
            email: 'email@gmail.com',
            given_name: 'givenName',
            family_name: 'familyName',
          };
          break;
        default:
          break;
      }
      return this.buildFetchResolvedPromise(body);
    }) as Mock;
  }

  static clearMocks() {
    vi.clearAllMocks();
  }
}
