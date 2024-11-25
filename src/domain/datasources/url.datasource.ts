import { CreateUrlDto, Url } from '..';

export interface UrlDataSource {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
  getUrls(userId: string): Promise<Url[]>;
  delete(userId: string): Promise<Url>;
}