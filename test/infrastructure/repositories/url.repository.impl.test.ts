import { beforeAll, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks } from '../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { CreateUrlDto, Url, type UrlRepository } from '../../../src/domain';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '../../../src/infrastructure';

UrlDataSourceMocks.setupMocks();

describe('UrlRepositoryImpl', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('create', async () => {
    const [_error, createUrlDto] = CreateUrlDto.create({
      name: 'name',
      originalUrl: 'originalUrl',
      userId: 'userId'
    });
    const url = await urlRepository.create(createUrlDto!);
    expect(url).instanceOf(Url);
    expect(url).toEqual({
      id: 'urlId',
      name: 'name',
      originalUrl: 'originalUrl',
      shortId: 'shortId',
      user: 'userId',
    });
  });

});