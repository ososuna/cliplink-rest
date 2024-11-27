import { Request, Response } from 'express';
import { UrlRepository, CreateUrl, CreateUrlDto, CustomError, GetUrls, DeleteUrl, GetUrl, UpdateUrl, UpdateUrlDto } from '../../domain';

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
    const createParams = {
      name: req.body.name,
      originalUrl: req.body.originalUrl,
      userId: req.body.user.id,
    };
    const [error, createUrlDto] = CreateUrlDto.create(createParams);
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

  getUrls = (req: Request, res: Response) => {
    const userId = req.body.user.id;
    new GetUrls(this.urlRepository)
      .execute(userId)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) );
  }

  deleteUrl = (req: Request, res: Response) => {
    const urlId = req.params.id;
    new DeleteUrl(this.urlRepository)
      .execute(urlId)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) );
  }

  getUrl = (req: Request, res: Response) => {
    const urlId = req.params.id;
    new GetUrl(this.urlRepository)
      .execute(urlId)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) );
  }

  updateUrl = (req: Request, res: Response) => {
    const [error, updateUrlDto] = UpdateUrlDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    const urlId = req.params.id;
    const userId = req.body.user.id;
    new UpdateUrl(this.urlRepository)
      .execute(urlId, userId, updateUrlDto!)
      .then( data => res.json(data) )
      .catch( error => this.handleError(error, res) );
  }
}