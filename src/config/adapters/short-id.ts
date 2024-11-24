import { nanoid } from 'nanoid';

export class ShortIdAdapter {
  static generateShortId(): string {
    return nanoid(8);
  }
}