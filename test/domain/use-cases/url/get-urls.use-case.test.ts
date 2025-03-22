import { describe, it, expect, vi, beforeAll } from 'vitest';
import { GetUrls, UrlRepository } from '@/domain';
import { UrlRepositoryImpl, UrlDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { UrlDataSourceMocks } from '@test/test-utils';

describe('get URLs use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('should get URLs', async () => {
    const expectedUrls = UrlDataSourceMocks.urls;
    vi.spyOn(urlRepository, 'getUrls').mockResolvedValue({
      page: 1,
      limit: 9,
      total: 1,
      totalPages: 1,
      items: expectedUrls
    });
    const result = await new GetUrls(urlRepository).execute('userId', 1, 9, '');
    expect(result.items).toEqual(UrlDataSourceMocks.urls);
    expect(result.total).toBe(1);
    expect(result.limit).toBe(9);
    expect(result.page).toBe(1);    
  });

  it('should throw error when page ir limit is invalid', async () => {
    await expect(new GetUrls(urlRepository).execute('userId', 0, 9, ''))
      .rejects.toThrow(Messages.INVALID_PAGE_AND_LIMIT);
  });

});