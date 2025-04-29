import { CreateUrlDto, Page, UpdateUrlDto, Url } from '@/domain';

export interface UrlRepository {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
  getUrls(userId: string, page: number, limit: number, search: string): Promise<Page<Url>>;
  getUrl(urlId: string): Promise<Url>;
  getUrlByShortId(shortId: string): Promise<Url>;
  delete(urlId: string): Promise<Url>;
  update(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url>;
}
