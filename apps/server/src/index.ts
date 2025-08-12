import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import helmet from 'helmet';
import v1Routes from '@/routers/v1';
import config from './config';
import { connectToDb, disconnectFromDb } from './lib/mongoose';
import limiter from './lib/rate-limit';
import { logger } from './lib/winston';

const app = express();

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

// Middlewares
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
  compression({
    threshold: 1024, // only compress res >= 1kb
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

// Server setup
(async () => {
  try {
    await connectToDb();

    app.use('/api/v1', v1Routes);
    const port = config.PORT;
    app.listen(port, () => {
      logger.info(`Server is running on port: ${port}`);
    });
  } catch (err) {
    logger.error('Error during server setup:', err);
  }

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
})();

// Handel server shutdown
const handleServerShutdown = async () => {
  try {
    await disconnectFromDb();
    logger.info('Server SHUTDOWN');
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown', err);
  }
};

// Listen for terminal signals ('SIGTERM` & `SIGINT`)
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
