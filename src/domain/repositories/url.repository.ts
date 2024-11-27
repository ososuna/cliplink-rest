import { CreateUrlDto, UpdateUrlDto, Url } from '..';

export interface UrlRepository {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
  getUrls(userId: string): Promise<Url[]>;
  getUrl(urlId: string): Promise<Url>;
  delete(urlId: string): Promise<Url>;
  update(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url>;
}