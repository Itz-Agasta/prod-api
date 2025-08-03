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
      // biome-ignore lint/suspicious/noConsole: false positive, logging server start
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: false positive, logging server start
    console.error('Error during server setup:', err);
  }

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
})();

// Handel server shutdown
const handleServerShutdown = async () => {
  try {
    await disconnectFromDb();
    // biome-ignore lint/suspicious/noConsole: false positive, logging server start
    console.log('Server SHUTDOWN');
    process.exit(0);
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: false positive, logging server start
    console.log('Error during server shutdown', err);
  }
};

// Listen for terminal signals ('SIGTERM` & `SIGINT`)
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
