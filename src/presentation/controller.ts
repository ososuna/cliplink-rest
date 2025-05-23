import { Request, Response } from 'express';
import { CustomError, type UrlRepository, RedirectUrl } from '@/domain';
import { envs } from '@/config';

export class MainController {
  constructor(private readonly urlRepository: UrlRepository) {}

  private handleError = (error: unknown, res: Response): Response | void => {
    if (error instanceof CustomError) {
      const notFoundUrl = process.env.NODE_ENV === 'production' ? `${envs.WEB_APP_URL}/404.html` : `${envs.WEB_APP_URL}/404`;
      return res.redirect(notFoundUrl);
    }
    console.log(error); // winston logger
    return res.status(500).json({ error: 'internal server error' });
  };

  shorten = (req: Request, res: Response): void => {
    const shortId = req.params.shortId;
    new RedirectUrl(this.urlRepository)
      .execute(shortId)
      .then((data) => res.redirect(data.originalUrl))
      .catch((error) => this.handleError(error, res));
  };

  welcome = (req: Request, res: Response): void => {
    res.send('Welcome to the amazing and powerful ClipLink API!');
  };
}
