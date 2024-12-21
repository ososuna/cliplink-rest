import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

interface Options {
  port?: number;
  routes: Router
}

export class Server {

  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port = 3000, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  start() {

    // middlewares
    this.app.use(cors({
      origin: 'http://localhost:4321', // Frontend URL
      credentials: true, // Allow cookies to be sent
    }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    // this.app.use(express.urlencoded({ extended: true })); // x-www-formurlencoder

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`server running on port ${ this.port }`);
    });

    return this.app;
  }
}