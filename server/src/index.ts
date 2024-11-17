import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/preview', async (req, res) => {
  const { url } = req.body;
  console.log('Received request for URL:', url); // Для отладки
  
  try {
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
             '',
             
      favicon: $('link[rel="icon"]').attr('href') || 
              $('link[rel="shortcut icon"]').attr('href') || 
              '/favicon.ico'
    };

    console.log('Preview data:', preview); // Для отладки
    res.json(preview);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 