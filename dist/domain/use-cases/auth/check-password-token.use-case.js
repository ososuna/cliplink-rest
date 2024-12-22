export class CheckPasswordToken {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(token) {
        const resetPasswordToken = await this.authRepository.isValidPasswordToken(token);
        return resetPasswordToken;
    }
}
//# sourceMappingURL=check-password-token.use-case.js.map