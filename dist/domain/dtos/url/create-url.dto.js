"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUrlDto = void 0;
class CreateUrlDto {
    constructor(name, originalUrl, userId) {
        this.name = name;
        this.originalUrl = originalUrl;
        this.userId = userId;
    }
    static create(object) {
        const { name, originalUrl, userId } = object;
        if (!originalUrl)
            return ['missing original url', undefined];
        return [undefined, new CreateUrlDto(name, originalUrl, userId)];
    }
}
exports.CreateUrlDto = CreateUrlDto;
