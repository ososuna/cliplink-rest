import { CreateUrlDto, Url, UrlRepository, UrlDataSource } from '../../domain';

export class UrlRepositoryImpl implements UrlRepository {

  constructor(
    private readonly urlDataSource: UrlDataSource
  ) {}

  create(createUrlDto: CreateUrlDto): Promise<Url> {
    return this.urlDataSource.create(createUrlDto);
  }

  getUrls(userId: string): Promise<Url[]> {
    return this.urlDataSource.getUrls(userId);
  }

  delete(urlId: string): Promise<Url> {
    return this.urlDataSource.delete(urlId);    
  }

}