export class UpdateUser {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(userId, updateUserDto) {
        const user = await this.authRepository.updateUser(userId, updateUserDto);
        return user;
    }
}
//# sourceMappingURL=update-user.use-case.js.map