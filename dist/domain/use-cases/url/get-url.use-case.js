export class GetUrl {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(urlId) {
        return await this.urlRepository.getUrl(urlId);
    }
}
//# sourceMappingURL=get-url.use-case.js.map