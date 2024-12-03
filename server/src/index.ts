import express from 'express';
import cors from 'cors';
import { db } from './db';
import suggestionsRouter from './api/suggestions';
import feedbackRouter from './api/feedback';
import previewRouter from './api/preview';

const app = express();
export const PORT = 3001;

// Добавляем логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Настраиваем CORS более детально
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Обработка ошибок JSON парсинга
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// Подключаем роутеры
app.use('/api', suggestionsRouter);
app.use('/api', feedbackRouter);
app.use('/api', previewRouter);

// Проверка работоспособности API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Глобальная обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET  /api/suggestions?limit=100&page=1');
  console.log('- POST /api/preview');
  // ... другие маршруты
}); 