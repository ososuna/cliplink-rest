import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;
const JWT_ACCESS_EXPIRATION = envs.JWT_ACCESS_EXPIRATION;
const JWT_REFRESH_EXPIRATION = envs.JWT_REFRESH_EXPIRATION;

// Adapter pattern
export class JwtAdapter {
  static async generateToken(payload: object, type: 'access' | 'refresh'): Promise<string | null> {
    return new Promise((resolve) => {
      const duration = type === 'access' ? JWT_ACCESS_EXPIRATION : JWT_REFRESH_EXPIRATION;
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(token!);
      });
    });
  }

  static async validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(decoded as T);
      });
    });
  }
}
