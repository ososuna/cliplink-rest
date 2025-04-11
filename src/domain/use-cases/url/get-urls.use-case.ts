import { CustomError, type Page, type UrlRepository } from '@/domain';
import { Messages } from '@/config';

interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string,
}

interface GetUrlsUseCase {
  execute(userId: string, page: number, limit: number, search: string): Promise<Page<Url>>;
}

export class GetUrls implements GetUrlsUseCase {

  constructor(
    private readonly urlRepository: UrlRepository,
  ) {}

  async execute(userId: string, page: number, limit: number, search: string): Promise<Page<Url>> {
    if (page < 1 || limit < 1) {
      throw CustomError.badRequest(Messages.INVALID_PAGE_AND_LIMIT);
    }
    return await this.urlRepository.getUrls(userId, page, limit, search);
  }
}
