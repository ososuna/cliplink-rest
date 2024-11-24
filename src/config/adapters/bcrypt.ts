import { compareSync, hashSync } from 'bcryptjs';

// Adapter pattern
export class BcryptAdapter {
  static hash(password: string): string {    
    return hashSync(password);
  }

  static compare(password: string, hashed: string): boolean {
    return compareSync(password, hashed);
  }
}