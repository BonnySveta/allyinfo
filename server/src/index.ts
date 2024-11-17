import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/preview', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received request for URL:', url);
    
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const preview = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             '',
      description: $('meta[property="og:description"]').attr('content') || 
                  $('meta[name="description"]').attr('content') || 
                  '',
      image: $('meta[property="og:image"]').attr('content') || 
             $('link[rel="image_src"]').attr('href') || 
             ''
    };

    console.log('Sending preview:', preview);
    res.json(preview);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Preview server running on port ${port}`);
}); 