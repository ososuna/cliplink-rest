export class DeleteUrl {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    async execute(userId) {
        return await this.urlRepository.delete(userId);
    }
}
//# sourceMappingURL=delete-url.use-case.js.map