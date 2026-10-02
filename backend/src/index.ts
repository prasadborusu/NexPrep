import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import codingRoutes from './routes/coding';
import resumeRoutes from './routes/resume';
import atsRoutes from './routes/ats';
import skillGapRoutes from './routes/skillGap';
import roadmapRoutes from './routes/roadmap';
import interviewRoutes from './routes/interview';
import placementRoutes from './routes/placements';
import bulkEmailRoutes from './routes/bulkEmail';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NexPrep Backend API',
    version: '1.0.0',
    model: config.hfModel,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/bulk-email', bulkEmailRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 NexPrep Backend API running on http://localhost:${config.port}`);
});

export default app;
