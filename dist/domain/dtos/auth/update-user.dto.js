"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
class UpdateUserDto {
    constructor(name, lastName, email) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
    }
    static create(object) {
        const { name, lastName, email } = object;
        return [
            undefined,
            new UpdateUserDto(name, lastName, email)
        ];
    }
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map