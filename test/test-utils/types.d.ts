import { type asMock } from './test-utils';

declare global {
  var asMock: typeof asMock;
}
