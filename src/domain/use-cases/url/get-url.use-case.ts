import { UrlRepository } from '../..';

interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string,
}

interface GetUrlUseCase {
  execute(urlId: string): Promise<Url>;
}

export class GetUrl implements GetUrlUseCase {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  async execute(urlId: string): Promise<Url> {
    return await this.urlRepository.getUrl(urlId);
  }

}