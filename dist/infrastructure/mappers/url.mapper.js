import { CustomError, Url } from '../../domain';
export class UrlMapper {
    static urlEntityFromObject(object) {
        const { id, _id, name, originalUrl, shortId, user } = object;
        if (!_id || !id)
            throw CustomError.badRequest('missing id');
        if (!originalUrl)
            throw CustomError.badRequest('missing original URL');
        if (!shortId)
            throw CustomError.badRequest('missing short id');
        return new Url(_id || id, shortId, originalUrl, user, name);
    }
}
//# sourceMappingURL=url.mapper.js.map