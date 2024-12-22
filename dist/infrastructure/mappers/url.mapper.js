"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlMapper = void 0;
const domain_1 = require("../../domain");
class UrlMapper {
    static urlEntityFromObject(object) {
        const { id, _id, name, originalUrl, shortId, user } = object;
        if (!_id || !id)
            throw domain_1.CustomError.badRequest('missing id');
        if (!originalUrl)
            throw domain_1.CustomError.badRequest('missing original URL');
        if (!shortId)
            throw domain_1.CustomError.badRequest('missing short id');
        return new domain_1.Url(_id || id, shortId, originalUrl, user, name);
    }
}
exports.UrlMapper = UrlMapper;
//# sourceMappingURL=url.mapper.js.map