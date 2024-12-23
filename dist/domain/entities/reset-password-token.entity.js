"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordToken = void 0;
class ResetPasswordToken {
    constructor(id, token, expiresAt, user) {
        this.id = id;
        this.token = token;
        this.expiresAt = expiresAt;
        this.user = user;
    }
}
exports.ResetPasswordToken = ResetPasswordToken;
