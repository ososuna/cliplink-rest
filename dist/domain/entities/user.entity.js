"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, lastName, email, role, password, img, githubId, googleId) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
        this.img = img;
        this.githubId = githubId;
        this.googleId = googleId;
    }
}
exports.User = User;
