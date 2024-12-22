export class CreateUrl {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(createUrlDto) {
        const url = await this.urlRepository.create(createUrlDto);
        return url;
    }
}
//# sourceMappingURL=create-url.use-case.js.map