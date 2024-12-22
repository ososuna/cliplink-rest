import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

let serverApp: any; // Placeholder for the Express app

async function main() {

  console.log('Testing env variables:', envs.MONGO_DB_NAME);
  
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  });

  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
  await server.start();
  serverApp = server.app; // Set the Express app instance
}

// Immediately start the app
main().catch((error) => {
  console.error('Error initializing server:', error);
});

export default (req: any, res: any) => {
  if (!serverApp) {
    res.status(503).send('Server is not ready yet');
    return;
  }
  return serverApp(req, res);
};