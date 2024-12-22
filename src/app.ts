import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

async function main() {

  console.log('Testing env variables:', envs.MONGO_DB_NAME);
  
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  });

  return new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
}

const server = main()
  .then((app) => app);

export default server;