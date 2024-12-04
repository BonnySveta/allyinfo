import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initializeAdmin } from './db';
import suggestionsRouter from './api/suggestions';
import feedbackRouter from './api/feedback';
import previewRouter from './api/preview';
import approvedRouter from './api/approved';
import { login, verifyToken } from './middleware/auth';
import path from 'path';

// Загружаем переменные окружения в самом начале
dotenv.config();

// Устанавливаем NODE_ENV если не задан
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Функция для логирования запросов с деталями
const logRequest = (req: express.Request) => {
  // Пропускаем логирование для некоторых частых запросов
  if (req.url.includes('/suggestions') && req.method === 'GET') {
    return;
  }

  console.log('\n=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  
  // Логируем важные заголовки
  const relevantHeaders = {
    'Content-Type': req.headers['content-type'],
    'Authorization': req.headers.authorization ? 'Present' : 'None',
    'Origin': req.headers.origin
  };
  console.log('Headers:', relevantHeaders);

  // Логируем тело только для POST/PUT запросов и только для определенных эндпоинтов
  if (['POST', 'PUT'].includes(req.method) && req.url.includes('/login')) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[HIDDEN]';
    }
    console.log('Body:', sanitizedBody);
  }
  console.log('======================\n');
};

// Функция для логирования ответов
const logResponse = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    // Пропускаем логирование для некоторых частых запросов
    if (!req.url.includes('/suggestions') || req.method !== 'GET') {
      console.log('\n=== Outgoing Response ===');
      console.log(`${req.method} ${req.url} - Status: ${res.statusCode}`);
      
      // Для ответов аутентификации скрываем токен
      if (req.url.includes('/login') && body.token) {
        console.log('Response: { token: [HIDDEN] }');
      } else if (!req.url.includes('/suggestions')) {
        // Не логируем большие списки данных
        console.log('Response:', body);
      }
      console.log('========================\n');
    }
    
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

// Настраиваем CORS с минимальным логированием
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Подключаем роуты аутентификации до общих обработчиков ошибок
app.post('/api/login', login);
app.get('/api/verify-token', verifyToken);

// Подключаем роутеры
app.use('/api', suggestionsRouter);
app.use('/api', feedbackRouter);
app.use('/api', previewRouter);
app.use('/api/approved', approvedRouter);

// Добавим интерфейсы для типизации
interface Section {
  section: string;
}

interface QueryParams {
  search?: string;
  section?: string;
  sortBy?: string;
  order?: string;
  page?: string | number;
  limit?: string | number;
  status?: string;
}

interface TotalCount {
  total: number;
}

interface DBSuggestion {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview_title: string;
  preview_description: string | null;
  preview_image: string | null;
  preview_favicon: string;
  preview_domain: string;
  status: string;
  created_at: string;
}

// Обновим роуты с правильной типизацией
app.get('/api/sections', async (req, res) => {
  try {
    const sections = db.prepare('SELECT DISTINCT section FROM suggestions WHERE status = "approved"').all() as Section[];
    res.json(sections.map(s => s.section));
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/suggestions', async (req, res) => {
  try {
    const { 
      search, 
      section, 
      sortBy, 
      order, 
      page = 1, 
      limit = 10, 
      status 
    } = req.query as QueryParams;
    
    const pageNum = Number(page);
    const limitNum = Number(limit);
    
    let query = db.prepare(`
      SELECT * FROM suggestions 
      WHERE status = ?
      ${search ? 'AND (preview_title LIKE ? OR preview_domain LIKE ?)' : ''}
      ${section ? 'AND section = ?' : ''}
      ORDER BY ${sortBy === 'title' ? 'preview_title' : sortBy === 'section' ? 'section' : 'created_at'} ${order === 'asc' ? 'ASC' : 'DESC'}
      LIMIT ? OFFSET ?
    `);

    const params = [
      status || 'approved',
      ...(search ? [`%${search}%`, `%${search}%`] : []),
      ...(section ? [section] : []),
      limitNum,
      (pageNum - 1) * limitNum
    ];

    const items = query.all(params) as DBSuggestion[];
    
    const totalQuery = db.prepare(`
      SELECT COUNT(*) as total FROM suggestions 
      WHERE status = ?
      ${search ? 'AND (preview_title LIKE ? OR preview_domain LIKE ?)' : ''}
      ${section ? 'AND section = ?' : ''}
    `);

    const { total } = totalQuery.get([
      status || 'approved',
      ...(search ? [`%${search}%`, `%${search}%`] : []),
      ...(section ? [section] : [])
    ]) as TotalCount;

    const response = {
      items: items.map(item => ({
        id: item.id,
        url: item.url,
        section: item.section,
        description: item.description,
        preview_title: item.preview_title,
        preview_description: item.preview_description,
        preview_image: item.preview_image,
        preview_favicon: item.preview_favicon,
        preview_domain: item.preview_domain,
        status: item.status,
        created_at: item.created_at
      })),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Проверка работоспособности API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Обработка ошибок JSON парсинга
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON Parse Error:', err);
    return res.status(400).json({ error: 'Invalid JSON', details: err.message });
  }
  next();
});

// Глобальная обработка ошибок
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