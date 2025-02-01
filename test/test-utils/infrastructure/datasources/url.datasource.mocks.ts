import { vi } from 'vitest';
import { Url } from '../../../../src/domain';
import { AuthDataSourceMocks } from './auth.datasource.mocks';

export class UrlDataSourceMocks {

  static readonly url: Url = {
    id: 'urlId',
    shortId: 'shortId',
    originalUrl: 'originalUrl',
    user: AuthDataSourceMocks.user,
    name: 'name'
  };

  static readonly createUrlDto = {
    name: 'name',
    originalUrl: 'originalUrl',
    userId: 'userId'
  };

  static readonly updateUrlDto = {
    name: 'newName',
    originalUrl: 'newOriginalUrl'
  }

  static setupMocks() {
    vi.mock('./../../../../src/data/mongodb', () => ({
      UserModel: {
        findById: vi.fn().mockResolvedValue({
          _id: 'userId',
          name: 'name',
          lastName: 'lastName',
          email: 'email',
          password: 'hashed-password',
          role: ['role'],
        }),
      },
      UrlModel: {
        findById: vi.fn().mockResolvedValue({
          _id: 'urlId',
          originalUrl: 'originalUrl',
          shortId: 'shortId',
          user: AuthDataSourceMocks.user,
          name: 'name',
          save: vi.fn(),
          active: true
        }),
        findOne: vi.fn().mockResolvedValue({
          _id: 'urlId',
          originalUrl: 'originalUrl',
          shortId: 'shortId',
          user: 'userId',
          name: 'name',
          save: vi.fn(),
          active: true
        }),
        find: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue({
          _id: 'urlId',
          name: 'name',
          originalUrl: 'originalUrl',
          shortId: 'shortId',
          user: 'userId',
          save: vi.fn(),
        }),
        updateMany: vi.fn().mockResolvedValue({ nModified: 1 }),
        findByIdAndUpdate: vi.fn().mockResolvedValue({
          _id: 'urlId',
          name: 'newName',
          originalUrl: 'originalUrl',
          shortId: 'shortId',
          user: 'userId',
          save: vi.fn(),
        }),
      },
    }));
  }
}