import { v4 as uuidv4 } from 'uuid';

export class IdAdapter {
  static generateId(): string {
    return uuidv4();
  }
}
