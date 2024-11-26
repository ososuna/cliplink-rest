import { UrlRepository } from '../..';

interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string,
}

interface GetUrlsUseCase {
  execute(urlId: string): Promise<Url[]>;
}

export class GetUrls implements GetUrlsUseCase {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  async execute(urlId: string): Promise<Url[]> {
    return await this.urlRepository.getUrls(urlId);
  }

}