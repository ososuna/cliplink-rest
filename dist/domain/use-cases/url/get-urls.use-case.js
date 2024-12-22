import { CustomError } from '../..';
export class GetUrls {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(urlId, page, limit, search) {
        if (page < 1 || limit < 1) {
            throw CustomError.badRequest('Page and limit must be positive integers');
        }
        return await this.urlRepository.getUrls(urlId, page, limit, search);
    }
}
//# sourceMappingURL=get-urls.use-case.js.map