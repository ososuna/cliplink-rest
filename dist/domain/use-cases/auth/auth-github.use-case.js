import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
export class AuthGithub {
    constructor(authRepository, signToken = JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    async execute(code) {
        const user = await this.authRepository.authGithub(code);
        const token = await this.signToken({ id: user.id }, '2h');
        if (!token)
            throw CustomError.internalServer('Error generating token');
        return {
            token,
            user: {
                id: user.id,
                githubId: user.githubId,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            }
        };
    }
}
//# sourceMappingURL=auth-github.use-case.js.map