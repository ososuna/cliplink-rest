import { beforeAll, describe, vi, it, expect } from 'vitest';
import { UrlRepository } from '../../../../src/domain/repositories/url.repository';
import { UrlRepositoryImpl } from '../../../../src/infrastructure/repositories/url.repository.impl';
import { UrlDataSourceImpl } from '../../../../src/infrastructure/datasources/url.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { UpdateUrl, UpdateUrlDto } from '../../../../src/domain';

describe('update URL use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('should update URL', async () => {
    const [error, updateUrlDto] = UpdateUrlDto.create({ name: 'newName' });
    expect(error).toBeUndefined();

    const expectedUrl = {
      id: 'urlId',
      name: 'newName',
      originalUrl: 'originalUrl',
      shortId: 'shortId',
      user: AuthDataSourceMocks.user
    };

    vi.spyOn(urlRepository, 'update').mockResolvedValue(expectedUrl);

    const result = await new UpdateUrl(urlRepository)
      .execute('urlId', 'userId', updateUrlDto!);
    
    expect(result).toEqual(expectedUrl);
    expect(urlRepository.update).toHaveBeenCalledWith('urlId', 'userId', updateUrlDto);

  });

});
