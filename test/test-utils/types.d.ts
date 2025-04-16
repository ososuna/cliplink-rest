// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type asMock } from '@test/test-utils';

declare global {
  var asMock: typeof asMock;
}
