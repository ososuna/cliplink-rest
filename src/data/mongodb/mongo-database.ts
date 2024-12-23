import mongoose from 'mongoose';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {

  static async connect(options: Options) {

    const { dbName, mongoUrl } = options;

    try {
      await mongoose.connect(mongoUrl, { dbName });
      console.log('mongo connection succesful ✅');
    } catch (error) {
      console.log('mongo connection error ❌');
      throw error;
    }
  }
}