"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDto = void 0;
const config_1 = require("./../../../config");
class RegisterUserDto {
    constructor(name, lastName, email, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    static create(object) {
        const { name, lastName, email, password } = object;
        if (!name)
            return ['missing name', undefined];
        if (!lastName)
            return ['missing last name', undefined];
        if (!email)
            return ['missing email', undefined];
        if (!config_1.Validators.email.test(email))
            return ['email is not valid'];
        if (!password)
            return ['missing password', undefined];
        if (password.length < 6)
            return ['password too short', undefined];
        return [
            undefined,
            new RegisterUserDto(name, lastName, email, password)
        ];
    }
}
exports.RegisterUserDto = RegisterUserDto;
