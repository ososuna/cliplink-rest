import { CreateUrlDto, CustomError, Url, UrlDataSource } from '../../domain';
import { ShortIdAdapter } from '../../config';
import { UrlModel, UserModel } from '../../data/mongodb';
import { UrlMapper } from '../mappers/url.mapper';

type ShortIdGenerator = () => string;

export class UrlDataSourceImpl implements UrlDataSource {

  constructor(
    private readonly shortIdGenerator: ShortIdGenerator = ShortIdAdapter.generateShortId
  ) {}  

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    try {
      const { name: baseName, originalUrl, userId } = createUrlDto;

      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.badRequest('user not found');

      const shortId = this.shortIdGenerator();
      let name = baseName;
      let counter = 1;
      // Loop until we find a unique name
      while (true) {
        const existingUrl = await UrlModel.findOne({ name });
        if (!existingUrl) {
          break;
        }
        counter++;
        name = `${baseName} (${counter})`;
      }
      
      const url = await UrlModel.create({
        name,
        originalUrl,
        shortId,
        user: user._id,
      });

      await url.save();

      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUrls(userId: string): Promise<Url[]> {
    try {
      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.badRequest('user not found');

      const urls = await UrlModel.find({ user: user._id });
      return urls.map(url => UrlMapper.urlEntityFromObject(url));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

}