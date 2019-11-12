import mongoose, { Mongoose } from 'mongoose';

import { MONGO_URI } from './config';
import logger from './logger';

const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  const conn: Mongoose = await mongoose.connect(MONGO_URI, options);
  logger.info(`MongoDB Connected: ${conn.connection}`);
};

export default connectDB;
