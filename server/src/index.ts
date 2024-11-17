import express from 'express';
import cors from 'cors';
import { load } from 'cheerio';
import { URL } from 'url';

const app = express();
app.use(cors());

app.get('/api/preview', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    // Пытаемся получить метаданные из разных источников
    const title = 
      $('meta[property="og:title"]').attr('content') || 
      $('title').text() || 
      '';
      
    const description = 
      $('meta[property="og:description"]').attr('content') || 
      $('meta[name="description"]').attr('content') || 
      '';
      
    const image = 
      $('meta[property="og:image"]').attr('content') || 
      $('link[rel="image_src"]').attr('href') || 
      '';

    const favicon = 
      $('link[rel="icon"]').attr('href') || 
      $('link[rel="shortcut icon"]').attr('href') || 
      '/favicon.ico';

    res.json({
      title: title.trim(),
      description: description.trim(),
      image,
      favicon: new URL(favicon, url).href
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to fetch preview' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Preview server running on port ${PORT}`);
}); 