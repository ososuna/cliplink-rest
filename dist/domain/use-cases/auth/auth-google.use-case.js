import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
export class AuthGoogle {
    constructor(authRepository, signToken = JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    async execute(code) {
        const user = await this.authRepository.authGoogle(code);
        const token = await this.signToken({ id: user.id }, '2h');
        if (!token)
            throw CustomError.internalServer('Error generating token');
        return {
            token,
            user: {
                id: user.id,
                googleId: user.googleId,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            }
        };
    }
}
//# sourceMappingURL=auth-google.use-case.js.map