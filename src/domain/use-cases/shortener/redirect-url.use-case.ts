import { Url } from '../..';
import { UrlRepository } from '../../repositories/url.repository';

interface RedirectUrlUseCase {
  execute(shortId: string): Promise<Url>
}

export class RedirectUrl implements RedirectUrlUseCase {
  
  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  async execute(shortId: string): Promise<Url> {
    const url = this.urlRepository.getUrlByShortId(shortId);
    return url;
  }
}