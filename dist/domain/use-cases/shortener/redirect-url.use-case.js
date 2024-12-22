export class RedirectUrl {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(shortId) {
        console.log(shortId);
        const url = this.urlRepository.getUrlByShortId(shortId);
        return url;
    }
}
//# sourceMappingURL=redirect-url.use-case.js.map