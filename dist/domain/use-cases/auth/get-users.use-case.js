export class GetUsers {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute() {
        const users = await this.authRepository.getUsers();
        return users;
    }
}
//# sourceMappingURL=get-users.use-case.js.map