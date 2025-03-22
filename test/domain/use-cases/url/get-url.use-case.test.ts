import { describe, it, expect, vi, beforeAll } from 'vitest';
import { GetUrl, UrlRepository } from '@/domain';
import { UrlRepositoryImpl, UrlDataSourceImpl } from '@/infrastructure';
import { UrlDataSourceMocks } from '@test/test-utils';

describe('get URL use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('should get a URL', async () => {
    const expectedUrl = UrlDataSourceMocks.url;
    vi.spyOn(urlRepository, 'getUrl').mockResolvedValue(expectedUrl);

    const result = await new GetUrl(urlRepository)
      .execute('urlId');

    expect(result).toEqual(expectedUrl);
    expect(urlRepository.getUrl).toHaveBeenCalledWith('urlId');
  });

});