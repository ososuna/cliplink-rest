import mongoose from 'mongoose';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options): Promise<void> {
    const { dbName, mongoUrl } = options;

    try {
      await mongoose.connect(mongoUrl, { dbName });
      console.log('mongo connection successful ✅');
    } catch (error) {
      console.error('mongo connection error ❌');
      throw error;
    }
  }
}
