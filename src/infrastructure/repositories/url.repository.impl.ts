import { CreateUrlDto, Url, UrlRepository } from '../../domain';

export class UrlRepositoryImpl implements UrlRepository {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  create(createUrlDto: CreateUrlDto): Promise<Url> {
    return this.urlRepository.create(createUrlDto);
  }

}