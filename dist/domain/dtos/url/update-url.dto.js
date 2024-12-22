export class UpdateUrlDto {
    constructor(name, originalUrl) {
        this.name = name;
        this.originalUrl = originalUrl;
    }
    static create(object) {
        const { name, originalUrl } = object;
        return [undefined, new UpdateUrlDto(name, originalUrl)];
    }
}
//# sourceMappingURL=update-url.dto.js.map