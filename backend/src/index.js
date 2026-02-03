import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import examsRouter from './routes/exams.js';
import lookupsRouter from './routes/lookups.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));

app.use('/api/lookups', lookupsRouter);
app.use('/api', examsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
