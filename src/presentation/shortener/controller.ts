import { Request, Response } from 'express';
import { CustomError, UrlRepository } from '../../domain';
import { RedirectUrl } from '../../domain';

export class ShortenerController {

  constructor(
    private readonly urlRepository: UrlRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.log(error); // winston logger
    return res.status(500).json({ error: 'internal server error' });
  }

  shorten = (req: Request, res: Response) => {
    const shortId = req.params.shortId;
    new RedirectUrl(this.urlRepository)
    .execute(shortId)
    .then( data => res.redirect(data.originalUrl) )
    .catch( error => this.handleError(error, res) );
  }

  welcome = (req: Request, res: Response) => {
    res.send('Welcome to the amazing and powerful ClipLink API!');
  }

}