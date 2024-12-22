import jwt from 'jsonwebtoken';
import { envs } from './envs';
const JWT_SEED = envs.JWT_SEED;
// Adapter pattern
export class JwtAdapter {
    static async generateToken(payload, duration = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(token);
            });
        });
    }
    static async validateToken(token) {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (err, decoded) => {
                if (err) {
                    resolve(null);
                    return;
                }
                resolve(decoded);
            });
        });
    }
}
//# sourceMappingURL=jwt.js.map