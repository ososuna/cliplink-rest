import { v4 as uuidv4 } from 'uuid';

export class ShortIdAdapter {
  static generateShortId(): string {
    return uuidv4().slice(0, 8);
  }
}