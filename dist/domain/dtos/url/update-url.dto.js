"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUrlDto = void 0;
class UpdateUrlDto {
    constructor(name, originalUrl) {
        this.name = name;
        this.originalUrl = originalUrl;
    }
    static create(object) {
        const { name, originalUrl } = object;
        return [undefined, new UpdateUrlDto(name, originalUrl)];
    }
}
exports.UpdateUrlDto = UpdateUrlDto;
//# sourceMappingURL=update-url.dto.js.map