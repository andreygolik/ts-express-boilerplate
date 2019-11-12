import mongoose, { Connection } from 'mongoose';

import { MONGO_URI } from './config';
import logger from './logger';

const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

interface MongooseConnection extends Connection {
  host?: string;
}

const connectDB = async () => {
  const { connection } = await mongoose.connect(MONGO_URI, options);
  const { host } = connection as MongooseConnection;
  logger.info(`MongoDB Connected to ${host}`);
};

export default connectDB;
