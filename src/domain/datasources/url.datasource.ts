import { CreateUrlDto, Url } from '..';;

export interface UrlDataSource {
  create(createUrlDto: CreateUrlDto): Promise<Url>;
}