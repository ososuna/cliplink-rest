import { describe, it, expect, vi, beforeAll } from 'vitest';
import { CreateUrl, CreateUrlDto, UrlRepository } from '../../../../src/domain';
import { UrlRepositoryImpl } from '../../../../src/infrastructure/repositories/url.repository.impl';
import { UrlDataSourceImpl } from '../../../../src/infrastructure/datasources/url.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';

describe('create URL use case', () => {

  let urlRepository: UrlRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlRepository = new UrlRepositoryImpl(new UrlDataSourceImpl(shortIdGenerator));
  });

  it('should create a new URL', async () => {
    const [error, createUrlDto] = CreateUrlDto.create({
      name: 'Example',
      originalUrl: 'https://example.com'
    });

    const expectedUrl = {
      id: '1',
      originalUrl: 'https://example.com',
      shortId: 'shortId',
      name: 'Example',
      user: AuthDataSourceMocks.user
    };

    vi.spyOn(urlRepository, 'create').mockResolvedValue(expectedUrl);

    const result = await new CreateUrl(urlRepository)
      .execute(createUrlDto!);

    expect(result).toEqual(expectedUrl);
    expect(urlRepository.create).toHaveBeenCalledWith(createUrlDto);
  });

});