import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import helmet from 'helmet';
import v1Routes from '@/routers/v1';
import limiter from './lib/rate-limit';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '',
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

app.use('/api/v1', v1Routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // biome-ignore lint/suspicious/noConsole: false positive, logging server start
  console.log(`Server is running on port ${port}`);
});
