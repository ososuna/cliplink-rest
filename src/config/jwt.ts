import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

// Adapter pattern
export class JwtAdapter {

  static async generateToken(payload: Object, duration: string =  '2h'): Promise<string|null> {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(token!);
      });
    });
  }
    
  static async validateToken<T>(token: string): Promise<T|null> {
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