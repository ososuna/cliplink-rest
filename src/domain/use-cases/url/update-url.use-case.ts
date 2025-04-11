import type { UpdateUrlDto, UrlRepository } from '@/domain';

interface Url {
  id: string;
  name?: string;
  originalUrl: string;
  shortId: string;
}

interface UpdateUrlUseCase {
  execute(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url>;
}

export class UpdateUrl implements UpdateUrlUseCase {
  constructor(private readonly urlRepository: UrlRepository) {}

  async execute(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url> {
    return await this.urlRepository.update(urlId, userId, updateUrlDto);
  }
}
