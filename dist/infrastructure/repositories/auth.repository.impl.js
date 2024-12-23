"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepositoryImpl = void 0;
class AuthRepositoryImpl {
    // dependency injection 💉
    // this implementation can use any data source
    // can be mongo, postgres, oracle, etc.
    constructor(authDataSource) {
        this.authDataSource = authDataSource;
    }
    login(loginUserDto) {
        return this.authDataSource.login(loginUserDto);
    }
    register(registerUserDto) {
        return this.authDataSource.register(registerUserDto);
    }
    getUsers() {
        return this.authDataSource.getUsers();
    }
    getUser(userId) {
        return this.authDataSource.getUser(userId);
    }
    updateUser(userId, updateUserDto) {
        return this.authDataSource.updateUser(userId, updateUserDto);
    }
    authGithub(code) {
        return this.authDataSource.authGithub(code);
    }
    authGoogle(code) {
        return this.authDataSource.authGoogle(code);
    }
    deleteAccount(userId) {
        return this.authDataSource.deleteAccount(userId);
    }
    getUserByEmail(email) {
        return this.authDataSource.getUserByEmail(email);
    }
    saveResetPasswordToken(userId, token) {
        return this.authDataSource.saveResetPasswordToken(userId, token);
    }
    isValidPasswordToken(token) {
        return this.authDataSource.isValidPasswordToken(token);
    }
    updatePassword(token, password) {
        return this.authDataSource.updatePassword(token, password);
    }
}
exports.AuthRepositoryImpl = AuthRepositoryImpl;
