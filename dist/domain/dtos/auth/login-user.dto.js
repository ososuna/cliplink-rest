import { Validators } from './../../../config';
export class LoginUserDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static create(object) {
        const { email, password } = object;
        if (!email)
            return ['missing email', undefined];
        if (!Validators.email.test(email))
            return ['email is not valid'];
        if (!password)
            return ['missing password', undefined];
        if (password.length < 6)
            return ['password too short', undefined];
        return [undefined, new LoginUserDto(email, password)];
    }
}
//# sourceMappingURL=login-user.dto.js.map