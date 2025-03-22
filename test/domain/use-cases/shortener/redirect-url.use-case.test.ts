import { beforeAll, describe, vi, it, expect } from 'vitest';
import { UrlRepository, RedirectUrl } from '@/domain';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '@/infrastructure';
import { UrlDataSourceMocks } from '@test/test-utils';

describe('redirect url use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });
  
  it('should redirect to the original url', async () => {
    const expectedUrl = UrlDataSourceMocks.url;
    vi.spyOn(urlRepository, 'getUrlByShortId').mockResolvedValue(expectedUrl);
    const result = await new RedirectUrl(urlRepository).execute('shortId');
    expect(result).toBe(expectedUrl);
    expect(urlRepository.getUrlByShortId).toHaveBeenCalledOnce();
    expect(urlRepository.getUrlByShortId).toHaveBeenCalledWith('shortId');
  });

});