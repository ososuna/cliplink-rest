import type { UrlRepository } from '@/domain';

interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string
}

interface DeleteUrlUseCase {
  execute(userId: string): Promise<Url>;
}

export class DeleteUrl implements DeleteUrlUseCase {

  constructor(
    private readonly urlRepository: UrlRepository,
  ) {}

  async execute(userId: string): Promise<Url> {
    return await this.urlRepository.delete(userId);
  }
}
