import { Types } from 'mongoose';
import { CustomError, } from '../../domain';
import { ShortIdAdapter } from '../../config';
import { UrlModel, UserModel } from '../../data/mongodb';
import { UrlMapper } from '../mappers/url.mapper';
export class UrlDataSourceImpl {
    constructor(shortIdGenerator = ShortIdAdapter.generateShortId) {
        this.shortIdGenerator = shortIdGenerator;
    }
    async getUniqueName(baseName, userId, urlId) {
        let name = baseName;
        let counter = 1;
        // Loop until we find a unique name
        while (true) {
            const existingUrl = await UrlModel.findOne({
                name,
                user: new Types.ObjectId(userId),
                active: true,
            });
            if (!existingUrl || existingUrl.id === urlId)
                break;
            counter++;
            name = `${baseName} (${counter})`;
        }
        return name;
    }
    async create(createUrlDto) {
        try {
            const { name: baseName, originalUrl, userId } = createUrlDto;
            let user;
            if (userId) {
                user = await UserModel.findById(userId);
                if (!user)
                    throw CustomError.notFound("user not found");
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
                user: user === null || user === void 0 ? void 0 : user._id,
            });
            await url.save();
            return UrlMapper.urlEntityFromObject(url);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUrls(userId, page = 1, limit = 9, search) {
        try {
            const user = await UserModel.findById(userId);
            if (!user)
                throw CustomError.notFound("User not found");
            const skip = (page - 1) * limit;
            // Apply search filter
            const query = {
                user: user._id,
                active: true,
                $or: search
                    ? [
                        { name: { $regex: search, $options: "i" } },
                        { shortId: { $regex: search, $options: "i" } },
                        { originalUrl: { $regex: search, $options: "i" } },
                    ]
                    : [],
            };
            // Fetch items and total count
            const [urls, total] = await Promise.all([
                UrlModel.find(query).skip(skip).limit(limit),
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
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async delete(urlId) {
        try {
            const url = await UrlModel.findById(urlId);
            if (!url)
                throw CustomError.notFound("url not found");
            url.active = false;
            await url.save();
            return UrlMapper.urlEntityFromObject(url);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUrl(urlId) {
        try {
            const url = await UrlModel.findById(urlId);
            if (!url)
                throw CustomError.notFound("url not found");
            return UrlMapper.urlEntityFromObject(url);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async update(urlId, userId, updateUrlDto) {
        try {
            const { name } = updateUrlDto;
            if (name) {
                updateUrlDto.name = await this.getUniqueName(name, userId, urlId);
            }
            const url = await UrlModel.findByIdAndUpdate(urlId, updateUrlDto, {
                new: true,
            });
            if (!url)
                throw CustomError.notFound("url not found");
            return UrlMapper.urlEntityFromObject(url);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
    async getUrlByShortId(shortId) {
        try {
            const url = await UrlModel.findOne({ shortId });
            if (!url)
                throw CustomError.notFound("url not found");
            return UrlMapper.urlEntityFromObject(url);
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
}
//# sourceMappingURL=url.datasource.impl.js.map