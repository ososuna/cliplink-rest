import mongoose from 'mongoose';
import winston from 'winston';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {

  static async connect(options: Options) {

    const { dbName, mongoUrl } = options;
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    try {
      await mongoose.connect(mongoUrl, { dbName });
      console.log('mongo connection succesful ✅');
    } catch (error) {
      console.log('mongo connection error ❌');
      logger.error(`Error connecting to mongo: ${error}`);
      throw error;
    }
  }
}