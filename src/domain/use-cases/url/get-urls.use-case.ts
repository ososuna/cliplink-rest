import { CustomError, Page, UrlRepository } from '../..';

interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string,
}

interface GetUrlsUseCase {
  execute(urlId: string, page: number, limit: number): Promise<Page<Url>>;
}

export class GetUrls implements GetUrlsUseCase {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  async execute(urlId: string, page: number, limit: number): Promise<Page<Url>> {
    if (page < 1 || limit < 1) {
      throw CustomError.badRequest('Page and limit must be positive integers');
    }
    return await this.urlRepository.getUrls(urlId, page, limit);
  }

}