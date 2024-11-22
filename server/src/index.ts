import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PreviewData } from './types/preview';
import { db } from './db';
import suggestionsRouter from './api/suggestions';
import feedbackRouter from './api/feedback';

const app = express();
export const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Подключаем роутеры
app.use('/api', suggestionsRouter);
app.use('/api', feedbackRouter);

// Описание API
app.get('/', (_req, res) => {
  res.json({
    message: 'API is running',
    endpoints: {
      suggestions: {
        getAll: 'GET /api/suggestions/all',
        getApproved: 'GET /api/suggestions',
        create: 'POST /api/suggestions',
        updateStatus: 'PUT /api/suggestions/:id/status',
        update: 'PUT /api/suggestions/:id',
        delete: 'DELETE /api/suggestions/:id'
      },
      feedback: {
        getAll: 'GET /api/feedback',
        create: 'POST /api/feedback',
        updateStatus: 'PUT /api/feedback/:id',
        delete: 'DELETE /api/feedback/:id'
      },
      preview: {
        get: 'POST /api/preview'
      }
    }
  });
});

// Preview endpoint
app.post('/api/preview', async (req, res) => {
  console.log('Received preview request for:', req.body.url);
  
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const response = await fetch(url, { timeout: 5000 });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch URL: ${response.statusText}` 
      });
    }

    const content = await response.text();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 

// Проверка кодировки базы данных
const encodingCheck = db.prepare('PRAGMA encoding').get();
console.log('Database encoding:', encodingCheck);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 