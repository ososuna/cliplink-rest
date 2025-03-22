import {
  CreateUrlDto,
  Url,
  UrlRepository,
  UrlDataSource,
  UpdateUrlDto,
  Page
} from '@/domain';

export class UrlRepositoryImpl implements UrlRepository {

  constructor(
    private readonly urlDataSource: UrlDataSource
  ) {}

  create(createUrlDto: CreateUrlDto): Promise<Url> {
    return this.urlDataSource.create(createUrlDto);
  }

  getUrls(userId: string, page: number, limit: number, search: string): Promise<Page<Url>> {
    return this.urlDataSource.getUrls(userId, page, limit, search);
  }

  delete(urlId: string): Promise<Url> {
    return this.urlDataSource.delete(urlId);    
  }

  getUrl(urlId: string): Promise<Url> {
    return this.urlDataSource.getUrl(urlId);
  }

  update(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url> {
    return this.urlDataSource.update(urlId, userId, updateUrlDto);
  }

  getUrlByShortId(shortId: string): Promise<Url> {
    return this.urlDataSource.getUrlByShortId(shortId);
  }

}