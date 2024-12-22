import { compareSync, hashSync } from 'bcryptjs';
// Adapter pattern
export class BcryptAdapter {
    static hash(password) {
        return hashSync(password);
    }
    static compare(password, hashed) {
        return compareSync(password, hashed);
    }
}
//# sourceMappingURL=bcrypt.js.map