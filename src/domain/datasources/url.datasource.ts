import { CreateUrlDto, Url } from '..';

export interface UrlDataSource {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
  getUrls(userId: string): Promise<Url[]>;
  delete(urlId: string): Promise<Url>;
}