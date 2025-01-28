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

  static setupMocks() {
    vi.mock('mongoose', () => ({
      Types: {
        ObjectId: vi.fn().mockImplementation(() => { return 'objectId' })
      }
    }));

    vi.mock('./../../../../src/data/mongodb', () => ({
      UrlModel: {
        findById: vi.fn().mockResolvedValue(UrlDataSourceMocks.url),
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
  }
}