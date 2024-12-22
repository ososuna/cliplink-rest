import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
export class LoginUser {
    constructor(authRepository, signToken = JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    async execute(loginUserDto) {
        const user = await this.authRepository.login(loginUserDto);
        const token = await this.signToken({ id: user.id }, '2h');
        if (!token)
            throw CustomError.internalServer('error generating token');
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            }
        };
    }
}
//# sourceMappingURL=login-user.use-case.js.map