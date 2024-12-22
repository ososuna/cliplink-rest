"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlDataSourceImpl = void 0;
const mongoose_1 = require("mongoose");
const domain_1 = require("../../domain");
const config_1 = require("../../config");
const mongodb_1 = require("../../data/mongodb");
const url_mapper_1 = require("../mappers/url.mapper");
class UrlDataSourceImpl {
    constructor(shortIdGenerator = config_1.ShortIdAdapter.generateShortId) {
        this.shortIdGenerator = shortIdGenerator;
    }
    getUniqueName(baseName, userId, urlId) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = baseName;
            let counter = 1;
            // Loop until we find a unique name
            while (true) {
                const existingUrl = yield mongodb_1.UrlModel.findOne({
                    name,
                    user: new mongoose_1.Types.ObjectId(userId),
                    active: true,
                });
                if (!existingUrl || existingUrl.id === urlId)
                    break;
                counter++;
                name = `${baseName} (${counter})`;
            }
            return name;
        });
    }
    create(createUrlDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name: baseName, originalUrl, userId } = createUrlDto;
                let user;
                if (userId) {
                    user = yield mongodb_1.UserModel.findById(userId);
                    if (!user)
                        throw domain_1.CustomError.notFound("user not found");
                }
                let name = baseName;
                if (baseName) {
                    name = yield this.getUniqueName(baseName, userId);
                }
                const shortId = this.shortIdGenerator();
                const url = yield mongodb_1.UrlModel.create({
                    name,
                    originalUrl,
                    shortId,
                    user: user === null || user === void 0 ? void 0 : user._id,
                });
                yield url.save();
                return url_mapper_1.UrlMapper.urlEntityFromObject(url);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUrls(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 9, search) {
            try {
                const user = yield mongodb_1.UserModel.findById(userId);
                if (!user)
                    throw domain_1.CustomError.notFound("User not found");
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
                const [urls, total] = yield Promise.all([
                    mongodb_1.UrlModel.find(query).skip(skip).limit(limit),
                    mongodb_1.UrlModel.countDocuments(query),
                ]);
                const totalPages = Math.ceil(total / limit);
                return {
                    page,
                    limit,
                    total,
                    totalPages,
                    items: urls.map((url) => url_mapper_1.UrlMapper.urlEntityFromObject(url)),
                };
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    delete(urlId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield mongodb_1.UrlModel.findById(urlId);
                if (!url)
                    throw domain_1.CustomError.notFound("url not found");
                url.active = false;
                yield url.save();
                return url_mapper_1.UrlMapper.urlEntityFromObject(url);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUrl(urlId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield mongodb_1.UrlModel.findById(urlId);
                if (!url)
                    throw domain_1.CustomError.notFound("url not found");
                return url_mapper_1.UrlMapper.urlEntityFromObject(url);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    update(urlId, userId, updateUrlDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = updateUrlDto;
                if (name) {
                    updateUrlDto.name = yield this.getUniqueName(name, userId, urlId);
                }
                const url = yield mongodb_1.UrlModel.findByIdAndUpdate(urlId, updateUrlDto, {
                    new: true,
                });
                if (!url)
                    throw domain_1.CustomError.notFound("url not found");
                return url_mapper_1.UrlMapper.urlEntityFromObject(url);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
    getUrlByShortId(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield mongodb_1.UrlModel.findOne({ shortId });
                if (!url)
                    throw domain_1.CustomError.notFound("url not found");
                return url_mapper_1.UrlMapper.urlEntityFromObject(url);
            }
            catch (error) {
                if (error instanceof domain_1.CustomError) {
                    throw error;
                }
                throw domain_1.CustomError.internalServer();
            }
        });
    }
}
exports.UrlDataSourceImpl = UrlDataSourceImpl;
