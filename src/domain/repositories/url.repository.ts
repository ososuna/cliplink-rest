import { CreateUrlDto, Url } from '..';

export interface UrlRepository {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
  getUrls(): Promise<Url[]>;
}