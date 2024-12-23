import cookieParser from 'cookie-parser';
import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import express from 'express';
import cors from 'cors';

// (() => {
//   main();
// })();

// async function main() {
  
//   await MongoDatabase.connect({
//     dbName: envs.MONGO_DB_NAME,
//     mongoUrl: envs.MONGO_URL
//   });

//   new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
// }

async function main() {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  });

  const app = express();
    // middlewares
    app.use(cors({
      origin: 'http://localhost:4321', // Frontend URL
      credentials: true, // Allow cookies to be sent
    }));
    app.use(express.json());
    app.use(cookieParser());

    app.use(AppRoutes.routes);

    app.listen(envs.PORT, () => {
      console.log(`server running on port ${ envs.PORT }`);
    });

    return app;
}

export default await main();