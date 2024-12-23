import mongoose from 'mongoose';
import winston from 'winston';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {

  static async connect(options: Options) {

    const { dbName, mongoUrl } = options;

    try {
      console.log('connecting to mongo...');
      console.log(dbName);
      const conection = await mongoose.connect(mongoUrl, { dbName });
      console.log(conection);
      console.log('mongo connection succesful ✅');
    } catch (error) {
      console.log('mongo connection error ❌');
      throw error;
    }
  }
}