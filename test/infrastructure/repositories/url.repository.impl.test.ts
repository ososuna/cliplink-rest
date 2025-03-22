import { beforeAll, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks, asMock } from '@test/test-utils';
import { CreateUrlDto, Url, type UrlRepository } from '@/domain';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '@/infrastructure';
import { UrlModel } from '@/data/mongodb';

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

  it('get urls', async () => {
    const urlsPage = await urlRepository.getUrls('userId', 1, 9, '');
    expect(urlsPage).instanceOf(Object);
    expect(urlsPage.items).toEqual(UrlDataSourceMocks.urls);
    expect(urlsPage.total).toBe(3);
    expect(urlsPage.limit).toBe(9);
    expect(urlsPage.page).toBe(1);
  });

  it('delete', async () => {
    const url = await urlRepository.delete('urlId');
    expect(url).instanceOf(Url);
    expect(url).toEqual(UrlDataSourceMocks.url);
  });

  it('get url', async () => {
    const url = await urlRepository.getUrl('urlId');
    expect(url).instanceOf(Url);
    expect(url).toEqual(UrlDataSourceMocks.url);
  });

  it('update', async () => {
    asMock(UrlModel.findOne).mockResolvedValue(null);
    const [_error, updateUrlDto] = CreateUrlDto.create({
      name: 'newName',
      originalUrl: 'newOriginalUrl'
    });
    const url = await urlRepository.update('urlId', 'userId', updateUrlDto!);
    expect(url).instanceOf(Url);
    expect(url).toEqual({
      id: 'urlId',
      name: 'newName',
      originalUrl: 'originalUrl',
      shortId: 'shortId',
      user: 'userId',
    });
  });

  it('get url by short id', async () => {
    asMock(UrlModel.findOne).mockResolvedValue({
      _id: 'urlId',
      originalUrl: 'originalUrl',
      shortId: 'shortId',
      user: 'userId',
      name: 'name',
      save: vi.fn(),
      active: true
    });
    const url = await urlRepository.getUrlByShortId('shortId');
    expect(url).instanceOf(Url);
    expect(url).toEqual({
      id: 'urlId',
      shortId: 'shortId',
      originalUrl: 'originalUrl',
      user: 'userId',
      name: 'name'
    });
  });

});