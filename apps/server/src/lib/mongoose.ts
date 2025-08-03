import { ServerApiVersion } from 'mongodb';
import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import config from '@/config';

const clientOptions: ConnectOptions = {
  dbName: 'prod-db',
  appName: 'blog API',
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDb = async (): Promise<void> => {
  if (!config.DATABASE_URL) {
    throw new Error('Mongo db is not config!!');
  }

  try {
    await mongoose.connect(config.DATABASE_URL, clientOptions);

    console.log('Connection to the db successful', {
      uri: config.DATABASE_URL,
      Options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    console.log('Error connecting to the db');
  }
};

export const disconnectFromDb = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log('Disconnect from the db', {
      uri: config.DATABASE_URL,
      Options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    console.log('Disconnect from the db', err);
  }
};
