import { Types } from 'mongoose';
import { type CreateUrlDto, CustomError, type Page, type UpdateUrlDto, type Url, type UrlDataSource } from '@/domain';
import { Messages, ShortIdAdapter } from '@/config';
import { UrlMapper } from '@/infrastructure';
import { UrlModel, UserModel } from '@/data/mongodb';

type ShortIdGenerator = () => string;

export class UrlDataSourceImpl implements UrlDataSource {
  constructor(private readonly shortIdGenerator: ShortIdGenerator = ShortIdAdapter.generateShortId) {}

  private async getUniqueName(baseName: string, userId?: string, urlId?: string): Promise<string> {
    let name = baseName;
    let counter = 1;
    // Loop until we find a unique name
    while (true) {
      const existingUrl = await UrlModel.findOne({
        name,
        user: new Types.ObjectId(userId),
        active: true,
      });
      if (!existingUrl || existingUrl.id === urlId) break;
      counter++;
      name = `${baseName} (${counter})`;
    }
    return name;
  }

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    try {
      const { name: baseName, originalUrl, userId } = createUrlDto;

      let user;
      if (userId) {
        user = await UserModel.findById(userId);
        if (!user) throw CustomError.notFound(Messages.USER_NOT_FOUND);
      }

      let name = baseName;
      if (baseName) {
        name = await this.getUniqueName(baseName, userId);
      }

      const shortId = this.shortIdGenerator();

      const url = await UrlModel.create({
        name,
        originalUrl,
        shortId,
        user: user?._id,
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

  async getUrls(userId: string, page: number = 1, limit: number = 9, search: string): Promise<Page<Url>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw CustomError.notFound(Messages.USER_NOT_FOUND);

      const skip = (page - 1) * limit;

      // Apply search filter
      const query = {
        user: user._id,
        active: true,
        $or: search
          ? [
              { name: { $regex: search, $options: 'i' } },
              { shortId: { $regex: search, $options: 'i' } },
              { originalUrl: { $regex: search, $options: 'i' } },
            ]
          : [],
      };

      // Fetch items and total count
      const [urls, total] = await Promise.all([
        UrlModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        UrlModel.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        page,
        limit,
        total,
        totalPages,
        items: urls.map((url) => UrlMapper.urlEntityFromObject(url)),
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async delete(urlId: string): Promise<Url> {
    try {
      const url = await UrlModel.findById(urlId);
      if (!url) throw CustomError.notFound(Messages.URL_NOT_FOUND);

      url.active = false;
      await url.save();

      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUrl(urlId: string): Promise<Url> {
    try {
      const url = await UrlModel.findById(urlId);
      if (!url) throw CustomError.notFound(Messages.URL_NOT_FOUND);
      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async update(urlId: string, userId: string, updateUrlDto: UpdateUrlDto): Promise<Url> {
    try {
      const { name } = updateUrlDto;
      if (name) {
        updateUrlDto.name = await this.getUniqueName(name, userId, urlId);
      }
      const url = await UrlModel.findByIdAndUpdate(urlId, updateUrlDto, {
        new: true,
      });
      if (!url) throw CustomError.notFound(Messages.URL_NOT_FOUND);
      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUrlByShortId(shortId: string): Promise<Url> {
    try {
      const url = await UrlModel.findOne({ shortId });
      if (!url) throw CustomError.notFound(Messages.URL_NOT_FOUND);
      return UrlMapper.urlEntityFromObject(url);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
