import { Url } from '..';

export interface UrlRepository {
  create(name: string, originalUrl: string): Promise<Url>
}