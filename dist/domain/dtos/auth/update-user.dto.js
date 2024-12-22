export class UpdateUserDto {
    constructor(name, lastName, email) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
    }
    static create(object) {
        const { name, lastName, email } = object;
        return [
            undefined,
            new UpdateUserDto(name, lastName, email)
        ];
    }
}
//# sourceMappingURL=update-user.dto.js.map