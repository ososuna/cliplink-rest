import { Request, Response } from 'express';
import { UrlRepository, CreateUrl, CreateUrlDto, CustomError } from '../../domain';

export class UrlController {

  // dependency injection 💉
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

  createUrl = (req: Request, res: Response) => {
    const [error, createUrlDto] = CreateUrlDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    // create use case instance
    new CreateUrl(this.urlRepository)
      .execute(createUrlDto!)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) );
  }

}