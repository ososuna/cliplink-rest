import { CustomError } from "../../";
import { JwtAdapter } from "../../../config";
export class UpdatePassword {
    constructor(authRepository, signToken = JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    async execute(token, password) {
        const user = await this.authRepository.updatePassword(token, password);
        const jwt = await this.signToken({ id: user.id }, "2h");
        if (!jwt)
            throw CustomError.internalServer("error generating token");
        return {
            token: jwt,
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            },
        };
    }
}
//# sourceMappingURL=update-password.use-case.js.map