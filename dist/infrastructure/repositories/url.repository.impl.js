export class UrlRepositoryImpl {
    constructor(urlDataSource) {
        this.urlDataSource = urlDataSource;
    }
    create(createUrlDto) {
        return this.urlDataSource.create(createUrlDto);
    }
    getUrls(userId, page, limit, search) {
        return this.urlDataSource.getUrls(userId, page, limit, search);
    }
    delete(urlId) {
        return this.urlDataSource.delete(urlId);
    }
    getUrl(urlId) {
        return this.urlDataSource.getUrl(urlId);
    }
    update(urlId, userId, updateUrlDto) {
        return this.urlDataSource.update(urlId, userId, updateUrlDto);
    }
    getUrlByShortId(shortId) {
        return this.urlDataSource.getUrlByShortId(shortId);
    }
}
//# sourceMappingURL=url.repository.impl.js.map