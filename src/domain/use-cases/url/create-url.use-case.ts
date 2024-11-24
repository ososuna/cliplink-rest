import { CreateUrlDto, UrlRepository } from '../..';
interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string
}

interface CreateUrlUseCase {
  execute(createUrlDto: CreateUrlDto): Promise<Url>
}

export class CreateUrl implements CreateUrlUseCase {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}
  
  async execute(createUrlDto: CreateUrlDto): Promise<Url> {
    const url = await this.urlRepository.create(createUrlDto);
    return url;
  }
}