import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

let serverInstance: Server | null = null;

async function main() {
  console.log('Testing env variables:', envs.MONGO_DB_NAME);

  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
  await server.start();

  serverInstance = server; // Store the server instance
  return server.app; // Return the Express app
}

// Immediately start the server and export the Express app
const serverApp = await main();
export default serverApp;
