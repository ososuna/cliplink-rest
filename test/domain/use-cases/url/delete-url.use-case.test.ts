import { describe, it, expect, vi, beforeAll } from 'vitest';
import { DeleteUrl, UrlRepository } from '@/domain';
import { UrlRepositoryImpl, UrlDataSourceImpl } from '@/infrastructure';
import { UrlDataSourceMocks } from '@test/test-utils';

describe('delete URL use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('should delete a URL', async () => {

    const expectedUrl = UrlDataSourceMocks.url;
    vi.spyOn(urlRepository, 'delete').mockResolvedValue(expectedUrl);

    const result = await new DeleteUrl(urlRepository)
      .execute('urlId');

    expect(result).toEqual(expectedUrl);
    expect(urlRepository.delete).toHaveBeenCalledWith('urlId');
  });

});