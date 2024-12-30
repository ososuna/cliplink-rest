import { rateLimit } from 'express-rate-limit';
import { Messages } from '../../config';

export class NonAuthLimiter {
  static limit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30, // Limit each IP to 60 requests per `window` (here, per 1 minute).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: Messages.TOO_MANY_REQUESTS }
  });
}
