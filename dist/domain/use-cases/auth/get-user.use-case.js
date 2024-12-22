export class GetUser {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(userId) {
        const user = await this.authRepository.getUser(userId);
        return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
        };
    }
}
//# sourceMappingURL=get-user.use-case.js.map