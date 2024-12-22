export class UpdateUrl {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(urlId, userId, updateUrlDto) {
        return await this.urlRepository.update(urlId, userId, updateUrlDto);
    }
}
//# sourceMappingURL=update-url.use-case.js.map