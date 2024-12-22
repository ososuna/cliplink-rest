export class DeleteAccount {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(userId) {
        return this.authRepository.deleteAccount(userId);
    }
}
//# sourceMappingURL=delete-account.use-case.js.map