import { Router } from 'express';

const router = Router();

//Routes
import authRoutes from '@/routers/v1/auth';

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'soon',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
export default router;
