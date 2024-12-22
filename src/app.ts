import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


async function main() {
  
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  });

  return await new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
}

// Export the main function for Vercel
export default async function handler(req: any, res: any) {
  const server = await main();
  server(req, res); // Delegate handling to Express
}