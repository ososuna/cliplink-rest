import { CreateUrlDto, CustomError, Url, UrlDataSource } from '../../domain';
import { ShortIdAdapter } from '../../config';
import { UrlModel } from '../../data/mongodb';
import { UrlMapper } from '../mappers/url.mapper';

type ShortIdGenerator = () => string;

export class UrlDataSourceImpl implements UrlDataSource {

  constructor(
    private readonly shortIdGenerator: ShortIdGenerator = ShortIdAdapter.generateShortId
  ) {}  

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    try {
      const { name, originalUrl } = createUrlDto;
      const shortId = this.shortIdGenerator();
      
      const url = await UrlModel.create({ name, originalUrl, shortId });

      await url.save();

      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

}