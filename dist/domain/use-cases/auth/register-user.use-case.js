import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
// This use case will allow us to change the repository and the way we are signing tokens
export class RegisterUser {
    constructor(authRepository, signToken = JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    async execute(registerUserDto) {
        const user = await this.authRepository.register(registerUserDto);
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
//# sourceMappingURL=register-user.use-case.js.map