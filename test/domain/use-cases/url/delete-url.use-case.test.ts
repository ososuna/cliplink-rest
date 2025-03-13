import { describe, it, expect, vi, beforeAll } from 'vitest';
import { UrlDataSourceMocks } from '../../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { DeleteUrl, UrlRepository } from '../../../../src/domain';
import { UrlRepositoryImpl } from '../../../../src/infrastructure/repositories/url.repository.impl';
import { UrlDataSourceImpl } from '../../../../src/infrastructure/datasources/url.datasource.impl';

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