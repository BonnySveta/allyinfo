import express from 'express';
import cors from 'cors';
import { db, initializeAdmin } from './db';
import suggestionsRouter from './api/suggestions';
import feedbackRouter from './api/feedback';
import previewRouter from './api/preview';
import { login, verifyToken } from './middleware/auth';
import path from 'path';

// Функция для логирования запросов с деталями
const logRequest = (req: express.Request) => {
  console.log('\n=== Incoming Request ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', {
    'Content-Type': req.headers['content-type'],
    'Authorization': req.headers.authorization ? 'Present' : 'None',
    'Origin': req.headers.origin,
    'User-Agent': req.headers['user-agent']
  });
  if (['POST', 'PUT'].includes(req.method)) {
    console.log('Body:', req.body);
  }
  console.log('======================\n');
};

// Функция для логирования ответов
const logResponse = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    console.log('\n=== Outgoing Response ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log('Response Body:', body);
    console.log('========================\n');
    
    return originalSend.call(this, body);
  };
  
  next();
};

const app = express();
export const PORT = 3001;

// Применяем логирование
app.use(logResponse);
app.use((req, res, next) => {
  logRequest(req);
  next();
});

// Настраиваем CORS с логированием
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000'];
    console.log('Request origin:', origin);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Логируем ошибки парсинга JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON Parse Error:', err);
    return res.status(400).json({ error: 'Invalid JSON', details: err.message });
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

// Улучшенная обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('\n=== Error Handler ===');
  console.error('Time:', new Date().toISOString());
  console.error('Error:', err);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Headers:', req.headers);
  console.error('==================\n');

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.post('/api/login', login);
app.get('/api/verify-token', verifyToken);

async function startServer() {
  try {
    console.log('\n=== Server Starting ===');
    console.log('Time:', new Date().toISOString());
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database Path:', path.join(__dirname, '../../data/suggestions.db'));
    
    await initializeAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Available routes:');
      console.log('- POST /api/login');
      console.log('- GET  /api/verify-token');
      console.log('- GET  /api/suggestions');
      console.log('===================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 