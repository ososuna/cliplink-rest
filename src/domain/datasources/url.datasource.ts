import { Url } from '..';

export interface UrlDataSource {
  create(name: string, originalUrl: string): Promise<Url>
}